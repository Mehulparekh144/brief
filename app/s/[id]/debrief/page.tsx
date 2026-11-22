import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TrackOnce } from "@/components/Analytics.tsx";
import { AutoRefresh, DebriefRating } from "@/components/Feedback.tsx";
import { DifficultyChip, ParHelp } from "@/components/Bits.tsx";
import { StartButton } from "@/components/StartButton.tsx";
import { Topbar } from "@/components/Topbar.tsx";
import { startChallenge } from "@/lib/actions.ts";
import { requireUser } from "@/lib/auth.ts";
import type { Debrief } from "@/lib/coach.ts";
import { fmt, k, parRange, verdict, vsPar } from "@/lib/format.ts";
import { db } from "@/lib/supabase.ts";
import { loadChallenge } from "@/src/challenge.ts";

export const dynamic = "force-dynamic";

type Brief = { text: string; tokens: number; actions: string[] };
const COLORS = ["var(--s1)", "var(--s2)", "var(--s3)"];

function briefsFrom(events: { kind: string; payload: Record<string, unknown> }[]): Brief[] {
  const out: Brief[] = [];
  for (const e of events) {
    if (e.kind === "user") out.push({ text: String(e.payload.text), tokens: 0, actions: [] });
    else if (!out.length) continue;
    else if (e.kind === "meter") out[out.length - 1].tokens = Number(e.payload.briefTokens ?? 0);
    else if (e.kind === "tool") out[out.length - 1].actions.push(String(e.payload.text));
  }
  return out;
}

/** "Read 4 files, 1 edit, ran 2 commands" */
function summarize(actions: string[]): string {
  const views = actions.filter((a) => a.startsWith("view")).length;
  const edits = actions.filter((a) => /^(str_replace|create|insert)/.test(a)).length;
  const cmds = actions.filter((a) => a.startsWith("bash")).length;
  const parts = [views && `read ${views} file${views > 1 ? "s" : ""}`, edits && `${edits} edit${edits > 1 ? "s" : ""}`, cmds && `ran ${cmds} command${cmds > 1 ? "s" : ""}`].filter(Boolean);
  return parts.length ? `${String(parts.join(", ")).replace(/^./, (c) => c.toUpperCase())}.` : "Replied only.";
}

/** Rounds up to 1, 2 or 5 × 10^n. */
function niceMax(n: number): number {
  const p = 10 ** Math.floor(Math.log10(Math.max(n, 1)));
  return [1, 2, 5, 10].map((m) => m * p).find((v) => v >= n) ?? 10 * p;
}

export default async function DebriefPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  const { data: s } = await db().from("sessions").select("*").eq("id", id).maybeSingle();
  if (!s || (s.user_id !== me.id && !me.admin)) notFound(); // admins open any debrief from a report
  if (s.status === "active") redirect(`/s/${id}`);
  const ch = loadChallenge(s.challenge);

  if (s.status !== "submitted") {
    return (
      <>
        <Topbar me={me} />
        <main className="page narrow">
          <p className="notice bad">This attempt ended without grading. It does not count.</p>
          <Link className="btn primary" href="/challenges" style={{ justifySelf: "start" }}>
            Back to practice
          </Link>
        </main>
      </>
    );
  }

  const { data: events } = await db().from("events").select("kind, payload").eq("session_id", id).order("seq");
  const briefs = briefsFrom(events ?? []);
  const total = s.tokens_total as number;
  const par = ch.par;
  const v = verdict(total, par);
  const debrief = s.debrief as (Debrief & { error?: string }) | null;
  const max = niceMax(Math.max(total, par?.high ?? 0) * 1.1);
  const pct = (n: number) => (n / max) * 100;
  const minutes = s.ended_at ? Math.max(1, Math.round((Date.parse(s.ended_at) - Date.parse(s.started_at)) / 60_000)) : null;
  let left = 0;

  return (
    <>
      <Topbar me={me} />
      <main className="page">
        <TrackOnce event="debrief_viewed" props={{ challenge: ch.slug, passed: s.passed, tokens: total, par: par?.median ?? null }} />
        <header style={{ display: "flex", flexWrap: "wrap", gap: "10px 16px", alignItems: "center" }}>
          <div style={{ marginRight: "auto", display: "grid", gap: 4 }}>
            <p className="label">Debrief</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <h1>{ch.title}</h1>
              <DifficultyChip level={ch.difficulty} />
            </div>
          </div>
          <span className={`pill ${s.passed ? "good" : "bad"}`}>
            {s.passed ? "✓" : "✗"} Hidden tests {s.tests_passed}/{s.tests_total} {s.passed ? "passed" : "failed"}
          </span>
          {minutes && <span className="pill">{minutes} min</span>}
          <span className="pill">{s.model}</span>
        </header>

        <section className="card score">
          <div>
            <div className="big">{fmt(total)}</div>
            <div className="big-sub">
              <span>tokens</span>
              {s.passed ? <span className={`pill ${v.tone}`}>{v.label}</span> : <span className="pill bad">Tests failed: no par result</span>}
              <span>{vsPar(total, par)}</span>
              <span>par {parRange(par)}</span>
              <ParHelp />
              <span>${Number(s.cost_usd).toFixed(4)}</span>
            </div>
          </div>
          <div className="stack">
            <span className="muted" style={{ fontSize: 12 }}>
              Where your tokens went, by message
            </span>
            <div className="stack-bar">
              {par && <span className="parband" style={{ left: `${pct(par.low)}%`, width: `max(4px, ${pct(par.high - par.low)}%)` }} title={`Par: ${fmt(par.low)}–${fmt(par.high)} tokens`} />}
              {briefs.map((b, i) => {
                const seg = (
                  <span
                    key={i}
                    className={`seg ${i === briefs.length - 1 ? "last" : ""}`}
                    style={{ left: `calc(${left}% + ${i ? 2 : 0}px)`, width: `calc(${pct(b.tokens)}% - ${i ? 2 : 0}px)`, background: COLORS[Math.min(i, 2)] }}
                    title={`Message ${i + 1}: ${fmt(b.tokens)} tokens`}
                  />
                );
                left += pct(b.tokens);
                return seg;
              })}
            </div>
            <div className="stack-axis">
              <span>0</span>
              <span>{k(max / 2)}</span>
              <span>{k(max)}</span>
            </div>
            <div className="legend">
              {briefs.slice(0, 3).map((_, i) => (
                <span key={i}>
                  <i style={{ background: COLORS[i] }} />
                  {i === 2 && briefs.length > 3 ? "Messages 3 and later" : `Message ${i + 1}`}
                </span>
              ))}
              {par && (
                <span>
                  <i style={{ background: "var(--hl)", outline: "1px solid var(--hl-line)" }} />
                  Par range
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="db-grid">
          <section className="card">
            <h2 style={{ fontSize: 16 }}>Your messages</h2>
            <div className="tbl">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Message</th>
                    <th className="n">Tokens</th>
                    <th>What the agent did</th>
                  </tr>
                </thead>
                <tbody>
                  {briefs.map((b, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td style={{ maxWidth: 280 }}>{b.text.length > 140 ? `${b.text.slice(0, 140)}…` : b.text}</td>
                      <td className="n">{fmt(b.tokens)}</td>
                      <td>{summarize(b.actions)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {debrief?.better_first_message && (
              <div className="better">
                <span className="label">A better first message</span>
                <p>{debrief.better_first_message}</p>
              </div>
            )}
            <details>
              <summary className="muted">The par brief (the reference run)</summary>
              <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{ch.briefs.good.join("\n\n")}</p>
            </details>
            <details>
              <summary className="muted">Your changes</summary>
              <pre className="tests-out" style={{ maxHeight: 400 }}>
                {s.diff || "No changes."}
              </pre>
            </details>
          </section>

          <section className="card">
            <h2 style={{ fontSize: 16 }}>Coach</h2>
            {!debrief ? (
              <>
                <p className="working">The coach is writing your debrief…</p>
                <AutoRefresh seconds={3} />
              </>
            ) : debrief.error ? (
              <p className="muted">{debrief.error}</p>
            ) : (
              <>
                <p>{debrief.summary}</p>
                <div>
                  {debrief.tips.map((t, i) => (
                    <div key={i} className="tip">
                      <div className="tip-head">
                        <span className={`pill ${t.kind === "keep" ? "good" : "warn"}`}>Msg {t.message}</span>
                        <b>{t.title}</b>
                      </div>
                      <p>{t.detail}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <form action={startChallenge}>
                <input type="hidden" name="slug" value={ch.slug} />
                <StartButton label="Try again" />
              </form>
              <Link className="btn" href="/challenges">
                All challenges
              </Link>
            </div>
            {debrief && !debrief.error && <DebriefRating sessionId={id} />}
          </section>
        </div>
      </main>
    </>
  );
}
