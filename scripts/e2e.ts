// End-to-end smoke test against a running server (npm run dev).
// Signs in as a test user with a password (not GitHub), plays late-fees with the par brief,
// submits, and waits for the coach. Costs about $0.15 (mostly the coach).
// Usage: npm run e2e   (E2E_BASE_URL defaults to http://localhost:3000)
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const EMAIL = "e2e@brieflab.test";
const password = randomBytes(18).toString("base64url");
const admin = createClient(URL_, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });
const step = (s: string) => console.log(`· ${s}`);

// 1. Test user: create or reset, approve, clear old sessions (keeps the daily limit and metrics clean).
const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
let userId = users.users.find((u) => u.email === EMAIL)?.id;
if (userId) await admin.auth.admin.updateUserById(userId, { password });
else userId = (await admin.auth.admin.createUser({ email: EMAIL, password, email_confirm: true })).data.user!.id;
await admin.from("profiles").update({ approved: true, github_login: "e2e-test" }).eq("id", userId);
await admin.from("sessions").delete().eq("user_id", userId);
step(`test user ${userId}`);

// 2. Sign in and keep the auth cookies the app expects.
const jar = new Map<string, string>();
const sb = createServerClient(URL_, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
  cookies: { getAll: () => [...jar].map(([name, value]) => ({ name, value })), setAll: (l) => l.forEach((c) => jar.set(c.name, c.value)) },
});
const { error: signInError } = await sb.auth.signInWithPassword({ email: EMAIL, password });
assert.ifError(signInError);
const cookie = [...jar].map(([n, v]) => `${n}=${v}`).join("; ");
const call = (path: string, init: RequestInit = {}) =>
  fetch(BASE + path, { ...init, redirect: "manual", headers: { cookie, "content-type": "application/json", ...init.headers } });

for (const p of ["/", "/challenges", "/me"]) {
  const r = await call(p);
  assert.equal(r.status, 200, `${p} returned ${r.status}`);
}
step("pages load: /, /challenges, /me");

// 3. Start a session.
const started = await call("/api/sessions", { method: "POST", body: JSON.stringify({ challenge: "late-fees" }) });
const { id, error } = await started.json();
assert.ok(id, `start failed: ${error}`);
assert.equal((await call(`/s/${id}`)).status, 200);
step(`session ${id} started, workspace loads`);

// 4. Read the event stream in the background.
type Ev = { seq: number; kind: string; data: Record<string, unknown> };
const events: Ev[] = [];
const ctrl = new AbortController();
void (async () => {
  const res = await call(`/api/sessions/${id}/stream`, { signal: ctrl.signal });
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
  let buf = "";
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += value;
      for (let i = buf.indexOf("\n\n"); i >= 0; i = buf.indexOf("\n\n")) {
        const data = buf.slice(0, i).split("\n").find((l) => l.startsWith("data: "));
        buf = buf.slice(i + 2);
        if (data) events.push(JSON.parse(data.slice(6)));
      }
    }
  } catch {}
})();
async function waitFor(pred: (e: Ev) => boolean, what: string, ms = 180_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const hit = events.find(pred);
    if (hit) return hit;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`timed out waiting for ${what}`);
}
await waitFor((e) => e.kind === "ready", "ready");

// 5. Free actions: file list, one file, public tests.
const files = (await (await call(`/api/sessions/${id}/files`)).json()).files as string[];
assert.ok(files.includes("src/billing/lateFee.js"));
const file = await (await call(`/api/sessions/${id}/files?path=src/billing/lateFee.js`)).json();
assert.match(file.content, /export function isLate/);
assert.equal((await call(`/api/sessions/${id}/tests`, { method: "POST" })).status, 200);
const tests = await waitFor((e) => e.kind === "tests", "public tests");
step(`free actions ok: ${files.length} files, public tests ${tests.data.passed}/${tests.data.total}`);

// 6. Brief the agent with the par brief.
const brief =
  "In src/billing/lateFee.js, isLate() compares timestamps with >=, so a payment at any time on the due date counts as late. A payment is late only when it is made on a later calendar day (UTC) than the due date. Fix isLate() with daysBetween from src/dates/compare.js. Do not change other files. Then run: node --test test/*.test.js";
assert.equal((await call(`/api/sessions/${id}/messages`, { method: "POST", body: JSON.stringify({ text: brief }) })).status, 200);
const busyAgain = await call(`/api/sessions/${id}/messages`, { method: "POST", body: JSON.stringify({ text: "second" }) });
assert.equal(busyAgain.status, 409, "a second message while busy must be refused");
await waitFor((e) => e.kind === "busy" && e.data.busy === false, "agent to finish");
const meter = events.filter((e) => e.kind === "meter").at(-1)!;
step(`agent done: ${meter.data.tokens} tokens, ${meter.data.calls} calls, ${events.filter((e) => e.kind === "tool").length} tool steps`);

// 7. Submit and wait for grading.
assert.equal((await call(`/api/sessions/${id}/submit`, { method: "POST" })).status, 200);
const submitted = await waitFor((e) => e.kind === "submitted", "grading");
ctrl.abort();
step(`graded: passed=${submitted.data.passed}`);

// 8. Coach writes the debrief.
let row: Record<string, unknown> | null = null;
for (let i = 0; i < 120 && !row?.debrief; i++) {
  row = (await admin.from("sessions").select("*").eq("id", id).single()).data;
  if (!row?.debrief) await new Promise((r) => setTimeout(r, 1000));
}
assert.ok(row?.debrief, "no debrief after 120 s");
const debrief = row.debrief as { summary?: string; tips?: unknown[]; error?: string };
assert.ok(!debrief.error, debrief.error ?? "");
const page = await call(`/s/${id}/debrief`);
assert.equal(page.status, 200);
assert.match(await page.text(), /Coach/);
step(`debrief: ${debrief.tips?.length} tips, coach cost $${Number(row.coach_cost_usd).toFixed(4)}`);
console.log(`  summary: ${debrief.summary}`);

// 9. Rating.
assert.equal((await call("/api/feedback", { method: "POST", body: JSON.stringify({ sessionId: id, rating: 5, text: "e2e" }) })).status, 200);
const { count } = await admin.from("events").select("*", { count: "exact", head: true }).eq("session_id", id);
step(`rating saved; ${count} events stored`);

// 10. Stop: a vague brief makes the agent explore; Stop must end its turn before the next model call.
const second = (await (await call("/api/sessions", { method: "POST", body: JSON.stringify({ challenge: "needle" }) })).json()).id as string;
assert.ok(second, "second session did not start");
const other = await call("/api/sessions", { method: "POST", body: JSON.stringify({ challenge: "late-fees" }) });
assert.equal(other.status, 409, "a second live session on another challenge must be refused");
await call(`/api/sessions/${second}/messages`, { method: "POST", body: JSON.stringify({ text: "Checkout crashes with some discount codes. Fix it." }) });
await call(`/api/sessions/${second}/stop`, { method: "POST" });
let stopEvents: Ev[] = [];
for (let i = 0; i < 120; i++) {
  stopEvents = (await admin.from("events").select("seq, kind, payload").eq("session_id", second).order("seq")).data!.map((e) => ({ seq: e.seq, kind: e.kind, data: e.payload }));
  if (stopEvents.some((e) => e.kind === "busy" && e.data.busy === false)) break;
  await new Promise((r) => setTimeout(r, 500));
}
const stopped = stopEvents.find((e) => e.kind === "stop");
assert.equal(stopped?.data.text, "Stopped by you.", "Stop did not stop the agent");
step(`stop works: agent stopped after ${stopEvents.filter((e) => e.kind === "tool").length} tool steps`);
await call(`/api/sessions/${second}/submit`, { method: "POST" });

// 11. Report linked to a session, visible to admins.
const sessions = (await (await call("/api/reports")).json()).sessions as { id: string }[];
assert.ok(sessions.some((s) => s.id === id), "report form must list the user's sessions");
const rep = await call("/api/reports", { method: "POST", body: JSON.stringify({ kind: "bug", title: "e2e report", details: "steps", sessionId: id, context: { page: `/s/${id}`, viewport: "1280x800" } }) });
const { id: reportId } = await rep.json();
assert.ok(reportId, "report was not saved");
const saved = (await admin.from("feedback").select("kind, session_id, context").eq("id", reportId).single()).data!;
assert.equal(saved.kind, "bug");
assert.equal(saved.session_id, id);
assert.equal((await call(`/admin/reports/${reportId}`)).status, 404, "non-admins must not see admin pages");
await admin.from("feedback").delete().eq("id", reportId);
step(`report #${reportId} saved with session and context; admin page hidden from non-admins`);
console.log(`\nE2E PASSED · ${row.tokens_total} tokens · tests ${row.tests_passed}/${row.tests_total} · agent $${Number(row.cost_usd).toFixed(4)}`);
process.exit(0);
