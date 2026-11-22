import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Sandbox } from "e2b";
import { posix } from "node:path";
import { HARNESS_VERSION, MODEL, Session } from "@/src/agent.ts";
import { type Challenge, capFor, loadChallenge } from "@/src/challenge.ts";
import { cost, total } from "@/src/meter.ts";
import { diffOf, openWorkspace, REPO, runTests, sh } from "@/src/sandbox.ts";
import { coach } from "./coach.ts";
import { db } from "./supabase.ts";

// shortcut: live sessions live in this server's memory. One server only; a redeploy ends them.
// Upgrade path: move the agent loop to a worker and fan events out through Redis.

export type Ev = { seq: number; kind: string; data: Record<string, unknown> };

type Live = {
  id: string;
  userId: string;
  ch: Challenge;
  sbx: Sandbox;
  session: Session;
  events: Ev[];
  listeners: Set<(e: Ev) => void>;
  busy: boolean;
  run: Promise<void> | null;
  lastActivity: number;
  warnedIdle: boolean;
  closed: boolean;
  timer: NodeJS.Timeout;
};

const SESSION_MS = 30 * 60_000;
const IDLE_WARN_MS = 8 * 60_000;
const IDLE_MS = 10 * 60_000;
export const SESSIONS_PER_DAY = 5;
export const MAX_MESSAGE = 2000;

const g = globalThis as unknown as { __brieflabLive?: Map<string, Live> };
const live = (g.__brieflabLive ??= new Map<string, Live>());
let anthropic: Anthropic | undefined;

export class UserError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const startOfTodayUTC = () => new Date(new Date().toISOString().slice(0, 10)).toISOString();

function emit(l: Live, kind: string, data: Record<string, unknown> = {}) {
  const ev = { seq: l.events.length + 1, kind, data };
  l.events.push(ev);
  for (const fn of l.listeners) fn(ev);
  void db()
    .from("events")
    .insert({ session_id: l.id, seq: ev.seq, kind, payload: data })
    .then(({ error }) => error && console.error("events insert:", error.message));
}

function meter(l: Live) {
  const s = l.session;
  emit(l, "meter", { tokens: total(s.tally), cost: cost(s.tally), calls: s.tally.calls, briefTokens: s.briefs.at(-1)?.tokens ?? 0 });
}

async function saveTotals(l: Live, extra: Record<string, unknown> = {}) {
  const t = l.session.tally;
  const { error } = await db()
    .from("sessions")
    .update({
      tokens_in: t.input,
      tokens_cache_write: t.cacheWrite,
      tokens_cache_read: t.cacheRead,
      tokens_out: t.output,
      tokens_total: total(t),
      cost_usd: cost(t),
      model_calls: t.calls,
      user_messages: l.session.briefs.length,
      ...extra,
    })
    .eq("id", l.id);
  if (error) console.error("sessions update:", error.message);
}

/** The live session, if it belongs to this user. */
export function getLive(id: string, userId: string): Live | null {
  const l = live.get(id);
  return l && l.userId === userId ? l : null;
}

/** Starts a session: checks limits, opens a sandbox, returns the session id. */
export async function startSession(userId: string, slug: string, isAdmin: boolean): Promise<string> {
  for (const l of live.values()) {
    if (l.userId === userId && !l.closed) {
      if (l.ch.slug === slug) return l.id;
      throw new UserError(`Finish or submit your "${l.ch.title}" session first.`, 409);
    }
  }
  const ch = loadChallenge(slug);
  const today = startOfTodayUTC();
  if (!isAdmin) {
    const { count } = await db().from("sessions").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("started_at", today);
    if ((count ?? 0) >= SESSIONS_PER_DAY) throw new UserError(`You used your ${SESSIONS_PER_DAY} sessions for today. Come back tomorrow.`, 429);
  }
  const { data: spend } = await db().from("sessions").select("cost_usd, coach_cost_usd").gte("started_at", today);
  const spent = (spend ?? []).reduce((sum, r) => sum + Number(r.cost_usd) + Number(r.coach_cost_usd), 0);
  if (spent >= Number(process.env.DAILY_SPEND_LIMIT_USD ?? 20)) throw new UserError("Practice is paused for today. Try again tomorrow.", 503);

  const { data: row, error } = await db()
    .from("sessions")
    .insert({ user_id: userId, challenge: slug, harness_version: HARNESS_VERSION, model: MODEL })
    .select("id")
    .single();
  if (error || !row) throw new Error(`Could not create the session: ${error?.message}`);

  let sbx: Sandbox;
  try {
    sbx = await openWorkspace(ch);
  } catch (e) {
    await db().from("sessions").update({ status: "error", ended_at: new Date().toISOString() }).eq("id", row.id);
    console.error("sandbox:", (e as Error).message);
    throw new UserError("All workspaces are in use. Try again in a minute.", 503);
  }

  anthropic ??= new Anthropic();
  const l = { id: row.id, userId, ch, sbx, events: [], listeners: new Set(), busy: false, run: null, lastActivity: Date.now(), warnedIdle: false, closed: false } as unknown as Live;
  l.session = new Session(anthropic, sbx, ch, (step) => {
    emit(l, step.kind, { text: step.text, tokens: "tokens" in step ? step.tokens : 0 });
    if (step.kind !== "stop") meter(l);
  });
  const started = Date.now();
  l.timer = setInterval(() => {
    if (l.closed || l.busy) return;
    const idle = Date.now() - l.lastActivity;
    if (Date.now() - started > SESSION_MS) void submit(l, "Time is up (30 minutes). Your session was submitted.");
    else if (idle > IDLE_MS) void submit(l, "No activity for 10 minutes. Your session was submitted.");
    else if (idle > IDLE_WARN_MS && !l.warnedIdle) {
      l.warnedIdle = true;
      emit(l, "notice", { text: "Still there? The session submits by itself in 2 minutes." });
    }
  }, 15_000);
  live.set(l.id, l);
  emit(l, "ready", { cap: capFor(ch) });
  meter(l);
  return l.id;
}

export function sendMessage(l: Live, text: string) {
  text = text.trim();
  if (!text) throw new UserError("Write a message first.");
  if (text.length > MAX_MESSAGE) throw new UserError(`Messages are limited to ${MAX_MESSAGE.toLocaleString()} characters.`);
  if (l.closed) throw new UserError("This session is finished.", 409);
  if (l.busy) throw new UserError("The agent is still working. Wait, or press Stop.", 409);
  if (l.session.stopped) throw new UserError(`The agent stopped: ${l.session.stopped}. Submit what you have.`, 409);
  l.busy = true;
  l.lastActivity = Date.now();
  l.warnedIdle = false;
  emit(l, "user", { text });
  emit(l, "busy", { busy: true });
  l.run = l.session
    .send(text)
    .catch((e) => {
      console.error("agent:", e);
      emit(l, "error", { text: e instanceof Anthropic.APIError ? `The model service failed (${e.status}). Try again.` : "The agent failed. Try again." });
    })
    .finally(async () => {
      l.busy = false;
      l.lastActivity = Date.now();
      meter(l);
      emit(l, "busy", { busy: false });
      await saveTotals(l);
    });
}

export function stopAgent(l: Live) {
  l.session.requestStop();
}

export async function publicTests(l: Live) {
  if (l.busy) throw new UserError("Wait for the agent to finish, or press Stop.", 409);
  l.lastActivity = Date.now();
  const r = await runTests(l.sbx, l.ch, false);
  emit(l, "tests", { passed: r.passed, total: r.total, ok: r.ok, output: r.output.slice(-6000) });
}

/** Files in the repo (reading costs 0 tokens). */
export async function listFiles(l: Live): Promise<string[]> {
  const r = await sh(l.sbx, "find . -type f -not -path './.git/*' | sed 's#^./##' | sort");
  return r.out.split("\n").filter(Boolean);
}

export async function readFile(l: Live, path: string): Promise<string> {
  const abs = posix.resolve(REPO, path);
  if (!abs.startsWith(`${REPO}/`)) throw new UserError("Bad path.");
  l.lastActivity = Date.now();
  return l.sbx.files.read(abs);
}

/** Stops the agent, runs hidden tests, saves results, then writes the debrief in the background. */
export async function submit(l: Live, reason?: string) {
  if (l.closed) return;
  l.closed = true;
  clearInterval(l.timer);
  l.session.requestStop();
  await l.run;
  if (reason) emit(l, "notice", { text: reason });
  emit(l, "submitting", {});
  try {
    const diff = await diffOf(l.sbx);
    const r = await runTests(l.sbx, l.ch, true);
    await saveTotals(l, {
      status: "submitted",
      tests_passed: r.passed,
      tests_total: r.total,
      passed: r.ok,
      diff: diff.slice(0, 100_000),
      ended_at: new Date().toISOString(),
    });
    emit(l, "submitted", { passed: r.ok });
    void writeDebrief(l, r);
  } catch (e) {
    console.error("submit:", e);
    await db().from("sessions").update({ status: "error", ended_at: new Date().toISOString() }).eq("id", l.id);
    emit(l, "error", { text: "Grading failed. This attempt does not count." });
  } finally {
    await l.sbx.kill().catch(() => {});
    setTimeout(() => live.delete(l.id), 120_000); // late stream readers can still replay
  }
}

async function writeDebrief(l: Live, tests: { passed: number; total: number; ok: boolean }) {
  // Agent actions per user message, from the event log.
  const actions: string[][] = [];
  for (const ev of l.events) {
    if (ev.kind === "user") actions.push([]);
    else if ((ev.kind === "tool" || ev.kind === "text") && actions.length) {
      actions.at(-1)!.push(ev.kind === "tool" ? String(ev.data.text) : `said: ${String(ev.data.text).slice(0, 200)}`);
    }
  }
  const s = l.session;
  try {
    const { debrief, costUsd } = await coach({
      ch: l.ch,
      tests,
      totalTokens: total(s.tally),
      briefs: s.briefs.map((b, i) => ({ ...b, actions: actions[i] ?? [] })),
    });
    await db().from("sessions").update({ debrief, coach_cost_usd: costUsd }).eq("id", l.id);
  } catch (e) {
    console.error("coach:", e);
    await db().from("sessions").update({ debrief: { error: "The coach could not write this debrief." } }).eq("id", l.id);
  }
}

export { submit as submitSession };
