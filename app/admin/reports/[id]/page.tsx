import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Topbar } from "@/components/Topbar.tsx";
import { setReportStatus } from "@/lib/actions.ts";
import { requireUser } from "@/lib/auth.ts";
import { fmt } from "@/lib/format.ts";
import { db } from "@/lib/supabase.ts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Report" };

const TONE: Record<string, "good" | "warn" | "bad"> = { user: "good", error: "bad", stop: "warn", notice: "warn" };

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
          <Card className="px-5">
            <h2 style={{ fontSize: 16 }}>Details</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{r.text || <span className="muted">No details.</span>}</p>
            {r.context && (
              <div>
                <Table>
                  <TableBody>
                    {Object.entries(r.context as Record<string, string>).map(([k, v]) => (
                      <TableRow key={k}>
                        <TableCell className="label">{k}</TableCell>
                        <TableCell style={{ fontSize: 13 }}>{v}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <form action={setReportStatus} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input type="hidden" name="id" value={r.id} />
              <span className="label">Status: {r.status}</span>
              {["new", "triaged", "done"].map((st) => (
                <Button key={st} name="status" value={st} size="sm" variant={r.status === st ? "default" : "outline"}>
                  {st}
                </Button>
              ))}
            </form>
          </Card>

          <Card className="px-5">
            <h2 style={{ fontSize: 16 }}>Linked session</h2>
            {!s ? (
              <p className="muted">No session linked.</p>
            ) : (
              <>
                <div>
                  <Table>
                    <TableBody>
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
                        <TableRow key={k}>
                          <TableCell className="label">{k}</TableCell>
                          <TableCell style={{ fontSize: 13 }}>{v}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {s.status === "submitted" && <Link href={`/s/${s.id}/debrief`}>Open the debrief →</Link>}
              </>
            )}
          </Card>
        </div>

        {events && (
          <Card className="px-5">
            <h2 style={{ fontSize: 16 }}>Session transcript ({events.length} events, meter updates hidden)</h2>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead className="text-right font-num tabular-nums">Tokens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((e) => {
                    const p = e.payload as Record<string, unknown>;
                    const content = p.text ?? (e.kind === "tests" ? `${p.passed}/${p.total} public tests` : e.kind === "busy" ? (p.busy ? "agent started" : "agent idle") : JSON.stringify(p));
                    return (
                      <TableRow key={e.seq}>
                        <TableCell className="num" style={{ fontSize: 11 }}>
                          {e.seq}
                        </TableCell>
                        <TableCell className="num" style={{ fontSize: 11 }}>
                          {e.created_at.slice(11, 19)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={(TONE[e.kind] ?? "") || "secondary"} className="font-num">{e.kind}</Badge>
                        </TableCell>
                        <TableCell style={{ whiteSpace: "pre-wrap", fontSize: 13, maxWidth: 640 }}>{String(content)}</TableCell>
                        <TableCell className="text-right font-num tabular-nums">{p.tokens ? fmt(Number(p.tokens)) : ""}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
        {s?.diff && (
          <details className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <summary>Diff</summary>
            <pre className="tests-out" style={{ maxHeight: 500 }}>
              {s.diff}
            </pre>
          </details>
        )}
        {s?.debrief && (
          <details className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <summary>Debrief JSON</summary>
            <pre className="tests-out">{JSON.stringify(s.debrief, null, 2)}</pre>
          </details>
        )}
      </main>
    </>
  );
}
