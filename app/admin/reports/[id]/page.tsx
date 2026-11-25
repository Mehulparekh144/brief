import Link from "next/link";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar.tsx";
import { setReportStatus } from "@/lib/actions.ts";
import { requireUser } from "@/lib/auth.ts";
import { fmt } from "@/lib/format.ts";
import { db } from "@/lib/supabase.ts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Report" };

const TONE: Record<string, string> = { user: "good", error: "bad", stop: "warn", notice: "warn" };

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  if (!me.admin) notFound();
  const { id } = await params;
  const { data: r } = await db().from("feedback").select("*").eq("id", Number(id)).maybeSingle();
  if (!r) notFound();
  const { data: author } = await db().from("profiles").select("github_login").eq("id", r.user_id).maybeSingle();
  const { data: s } = r.session_id ? await db().from("sessions").select("*").eq("id", r.session_id).maybeSingle() : { data: null };
  const { data: events } = r.session_id
    ? await db().from("events").select("seq, kind, payload, created_at").eq("session_id", r.session_id).neq("kind", "meter").order("seq")
    : { data: null };

  return (
    <>
      <Topbar me={me} />
      <main className="page">
        <Link href="/admin" className="muted">
          ← All reports
        </Link>
        <header style={{ display: "grid", gap: 6 }}>
          <p className="label">
            Report #{r.id} · {r.kind} · {r.created_at.slice(0, 16).replace("T", " ")} UTC · by {author?.github_login ?? "unknown"}
          </p>
          <h1>{r.title ?? (r.rating ? `Debrief rated ${r.rating}/5` : "Note")}</h1>
        </header>

        <div className="db-grid">
          <section className="card">
            <h2 style={{ fontSize: 16 }}>Details</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{r.text || <span className="muted">No details.</span>}</p>
            {r.context && (
              <div className="tbl">
                <table>
                  <tbody>
                    {Object.entries(r.context as Record<string, string>).map(([k, v]) => (
                      <tr key={k}>
                        <td className="label">{k}</td>
                        <td style={{ fontSize: 13 }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <form action={setReportStatus} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input type="hidden" name="id" value={r.id} />
              <span className="label">Status: {r.status}</span>
              {["new", "triaged", "done"].map((st) => (
                <button key={st} name="status" value={st} className={`btn ${r.status === st ? "primary" : ""}`}>
                  {st}
                </button>
              ))}
            </form>
          </section>

          <section className="card">
            <h2 style={{ fontSize: 16 }}>Linked session</h2>
            {!s ? (
              <p className="muted">No session linked.</p>
            ) : (
              <>
                <div className="tbl">
                  <table>
                    <tbody>
                      {[
                        ["id", s.id],
                        ["challenge", s.challenge],
                        ["status", s.status],
                        ["model / harness", `${s.model} / v${s.harness_version}`],
                        ["tokens", `${fmt(s.tokens_total)} (in ${fmt(s.tokens_in)}, cache write ${fmt(s.tokens_cache_write)}, cache read ${fmt(s.tokens_cache_read)}, out ${fmt(s.tokens_out)})`],
                        ["calls / messages", `${s.model_calls} / ${s.user_messages}`],
                        ["tests", s.tests_total == null ? "not graded" : `${s.tests_passed}/${s.tests_total} ${s.passed ? "passed" : "failed"}`],
                        ["cost", `agent $${Number(s.cost_usd).toFixed(4)} · coach $${Number(s.coach_cost_usd).toFixed(4)}`],
                        ["time (UTC)", `${s.started_at.slice(0, 19).replace("T", " ")} → ${s.ended_at ? s.ended_at.slice(11, 19) : "…"}`],
                      ].map(([k, v]) => (
                        <tr key={k}>
                          <td className="label">{k}</td>
                          <td style={{ fontSize: 13 }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {s.status === "submitted" && <Link href={`/s/${s.id}/debrief`}>Open the debrief →</Link>}
              </>
            )}
          </section>
        </div>

        {events && (
          <section className="card">
            <h2 style={{ fontSize: 16 }}>Session transcript ({events.length} events, meter updates hidden)</h2>
            <div className="tbl">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Time</th>
                    <th>Kind</th>
                    <th>Content</th>
                    <th className="n">Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => {
                    const p = e.payload as Record<string, unknown>;
                    const content = p.text ?? (e.kind === "tests" ? `${p.passed}/${p.total} public tests` : e.kind === "busy" ? (p.busy ? "agent started" : "agent idle") : JSON.stringify(p));
                    return (
                      <tr key={e.seq}>
                        <td className="num" style={{ fontSize: 11 }}>
                          {e.seq}
                        </td>
                        <td className="num" style={{ fontSize: 11 }}>
                          {e.created_at.slice(11, 19)}
                        </td>
                        <td>
                          <span className={`pill ${TONE[e.kind] ?? ""}`}>{e.kind}</span>
                        </td>
                        <td style={{ whiteSpace: "pre-wrap", fontSize: 13, maxWidth: 640 }}>{String(content)}</td>
                        <td className="n">{p.tokens ? fmt(Number(p.tokens)) : ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {s?.diff && (
          <details className="card">
            <summary>Diff</summary>
            <pre className="tests-out" style={{ maxHeight: 500 }}>
              {s.diff}
            </pre>
          </details>
        )}
        {s?.debrief && (
          <details className="card">
            <summary>Debrief JSON</summary>
            <pre className="tests-out">{JSON.stringify(s.debrief, null, 2)}</pre>
          </details>
        )}
      </main>
    </>
  );
}
