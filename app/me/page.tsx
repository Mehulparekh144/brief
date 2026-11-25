import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Topbar } from "@/components/Topbar.tsx";
import { requireUser } from "@/lib/auth.ts";
import { fmt, verdict, vsPar } from "@/lib/format.ts";
import { db } from "@/lib/supabase.ts";
import { type Challenge, listChallenges, loadChallenge } from "@/src/challenge.ts";

export const dynamic = "force-dynamic";
export const metadata = { title: "My sessions" };

export default async function HistoryPage() {
  const me = await requireUser();
  const challenges = new Map<string, Challenge>(listChallenges({ drafts: true }).map((s) => [s, loadChallenge(s)]));
  const { data: rows } = await db()
    .from("sessions")
    .select("id, challenge, status, passed, tokens_total, tests_passed, tests_total, started_at")
    .eq("user_id", me.id)
    .order("started_at", { ascending: false })
    .limit(100);

  return (
    <>
      <Topbar me={me} />
      <main className="page">
        <header style={{ display: "grid", gap: 6 }}>
          <p className="label">My sessions</p>
          <h1>Your sessions</h1>
          <p className="muted">Compare each try with your last one, not with other people.</p>
        </header>
        {!rows?.length ? (
          <p className="notice">
            No sessions yet. <Link href="/challenges">Pick a challenge</Link> to start.
          </p>
        ) : (
          <Card className="px-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Challenge</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right font-num tabular-nums">Tokens</TableHead>
                  <TableHead>vs par</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const ch = challenges.get(r.challenge);
                  const v = verdict(r.tokens_total, ch?.par);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="num" style={{ fontSize: 12 }}>
                        {new Date(r.started_at).toISOString().slice(0, 16).replace("T", " ")}
                      </TableCell>
                      <TableCell>{ch?.title ?? r.challenge}</TableCell>
                      <TableCell>
                        {r.status !== "submitted" ? (
                          <Badge variant="secondary" className="font-num">Not graded</Badge>
                        ) : r.passed ? (
                          <Badge variant={(v.tone) || "secondary"} className="font-num">{v.label}</Badge>
                        ) : (
                          <Badge variant="bad" className="font-num">
                            Failed {r.tests_passed}/{r.tests_total}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-num tabular-nums">{fmt(r.tokens_total)}</TableCell>
                      <TableCell className="muted">{r.status === "submitted" ? vsPar(r.tokens_total, ch?.par) : ""}</TableCell>
                      <TableCell>{r.status === "submitted" && <Link href={`/s/${r.id}/debrief`}>Debrief</Link>}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </main>
    </>
  );
}
