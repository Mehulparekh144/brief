import Link from "next/link";
import { Topbar } from "@/components/Topbar.tsx";
import { requireUser } from "@/lib/auth.ts";
import { fmt, verdict, vsPar } from "@/lib/format.ts";
import { db } from "@/lib/supabase.ts";
import { type Challenge, listChallenges, loadChallenge } from "@/src/challenge.ts";

export const dynamic = "force-dynamic";

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
          <div className="tbl card">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Challenge</th>
                  <th>Result</th>
                  <th className="n">Tokens</th>
                  <th>vs par</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const ch = challenges.get(r.challenge);
                  const v = verdict(r.tokens_total, ch?.par);
                  return (
                    <tr key={r.id}>
                      <td className="num" style={{ fontSize: 12 }}>
                        {new Date(r.started_at).toISOString().slice(0, 16).replace("T", " ")}
                      </td>
                      <td>{ch?.title ?? r.challenge}</td>
                      <td>
                        {r.status !== "submitted" ? (
                          <span className="pill">Not graded</span>
                        ) : r.passed ? (
                          <span className={`pill ${v.tone}`}>{v.label}</span>
                        ) : (
                          <span className="pill bad">
                            Failed {r.tests_passed}/{r.tests_total}
                          </span>
                        )}
                      </td>
                      <td className="n">{fmt(r.tokens_total)}</td>
                      <td className="muted">{r.status === "submitted" ? vsPar(r.tokens_total, ch?.par) : ""}</td>
                      <td>{r.status === "submitted" && <Link href={`/s/${r.id}/debrief`}>Debrief</Link>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
