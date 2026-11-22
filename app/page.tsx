import Link from "next/link";
import { Topbar } from "@/components/Topbar.tsx";
import { currentUser } from "@/lib/auth.ts";

export const dynamic = "force-dynamic";

const EXAMPLE = [
  { n: 1, text: "fix the late fee bug", tokens: "16,290", note: "Read 6 files and searched the code" },
  { n: 2, text: "isLate() in src/billing/lateFee.js compares timestamps…", tokens: "7,685", note: "The par brief: 3 model calls" },
];

export default async function Landing({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const me = await currentUser();
  const { error } = await searchParams;
  return (
    <>
      <Topbar me={me} />
      <main className="page">
        {error === "signin" && <p className="notice bad">Sign-in did not finish. Try again.</p>}
        <section className="hero">
          <span className="label">Practice range for AI coding agents</span>
          <h1>Get the same result with fewer tokens.</h1>
          <p>
            You brief an AI agent on a real coding task. A live meter counts every token. Hidden tests check the result. Then a coach shows you
            where your tokens went and how to say it better.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {me?.approved ? (
              <Link className="btn primary big" href="/challenges">
                Go to practice
              </Link>
            ) : me ? (
              <Link className="btn primary big" href="/waitlist">
                You are on the waitlist
              </Link>
            ) : (
              <a className="btn primary big" href="/auth/login">
                Sign in with GitHub
              </a>
            )}
          </div>
        </section>

        <ol className="loop" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li className="card">
            <span className="label">Step 1</span>
            <strong>
              <mark>Brief</mark>
            </strong>
            <p>Read the task and the code. Reading is free. Every message you send costs tokens.</p>
          </li>
          <li className="card">
            <span className="label">Step 2</span>
            <strong>Run</strong>
            <p>The agent edits code and runs tests in a private sandbox. The meter counts every token, live.</p>
          </li>
          <li className="card">
            <span className="label">Step 3</span>
            <strong>Debrief</strong>
            <p>Hidden tests grade the work. The coach shows the cost of each message. Try again and beat par.</p>
          </li>
        </ol>

        <section className="card">
          <span className="label">Example · the same bug, two briefs</span>
          <div className="tbl">
            <table>
              <thead>
                <tr>
                  <th>Brief</th>
                  <th className="n">Tokens</th>
                  <th>What happened</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLE.map((r) => (
                  <tr key={r.n}>
                    <td>
                      <code>{r.text}</code>
                    </td>
                    <td className="n">{r.tokens}</td>
                    <td className="muted">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ fontSize: 13 }}>
            Measured on Claude Haiku 5.5. Both briefs fixed the bug. The precise one used half the tokens.
          </p>
        </section>
        <p className="muted" style={{ fontSize: 12 }}>
          Brieflab is a private beta. We save your sessions and use them to improve the product. Ask us and we delete your data.
        </p>
      </main>
    </>
  );
}
