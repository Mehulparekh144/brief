import Link from "next/link";
import { Brie, Logo } from "@/components/Brie.tsx";
import { Topbar } from "@/components/Topbar.tsx";
import { currentUser } from "@/lib/auth.ts";
import { DESCRIPTION, SITE } from "@/lib/format.ts";
import { CATEGORIES, type Category, listChallenges, loadChallenge } from "@/src/challenge.ts";

export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };

const PRACTICE: Record<Category, string> = {
  "bug-fix": "Name the file, the symptom and the real cause, so the agent does not search.",
  spec: "Give every rule and edge case up front, so the agent does not guess.",
  refactor: "Say what to change and what not to touch.",
  testing: "Show the exact shape of the tests you want.",
  security: "State the threat and the safe pattern, such as parameters for SQL.",
};

// Structured data. "<" is escaped so the JSON cannot close the script tag.
const jsonLd = (count: number) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE}/#org`, name: "Brieflab", url: `${SITE}/`, logo: `${SITE}/icon.svg` },
      {
        "@type": "WebApplication",
        name: "Brieflab",
        url: `${SITE}/`,
        description: DESCRIPTION,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        publisher: { "@id": `${SITE}/#org` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [`${count} coding challenges`, "Live token meter", "Hidden-test grading", "AI coach debrief"],
      },
    ],
  }).replace(/</g, "\\u003c");

const EXAMPLE = [
  { n: 1, text: "fix the late fee bug", tokens: "16,290", note: "Read 6 files and searched the code" },
  { n: 2, text: "isLate() in src/billing/lateFee.js compares timestamps…", tokens: "7,685", note: "The par brief: 3 model calls" },
];

export default async function Landing({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const me = await currentUser();
  const challenges = listChallenges().map(loadChallenge);
  const { error } = await searchParams;
  return (
    <>
      <Topbar me={me} />
      <main className="page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(challenges.length) }} />
        {error === "signin" && <p className="notice bad">Sign-in did not finish. Try again.</p>}
        <section className="hero">
          <div className="hero-text">
          <Logo big />
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
          </div>
          <figure className="hero-brie">
            <Brie mood="happy" size={150} />
            <figcaption className="bubble">Hi, I&apos;m Brie. Send the agent a clear brief, and I&apos;ll show you where every token went.</figcaption>
          </figure>
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

        <section style={{ display: "grid", gap: 12 }}>
          <h2 style={{ fontSize: 22 }}>What you practice</h2>
          <p className="muted">
            {challenges.length} challenges in JavaScript and Python, from easy to hard. Each one teaches one briefing skill.
          </p>
          <div className="loop practice">
            {(Object.keys(CATEGORIES) as Category[]).map((c) => (
              <div key={c} className="card">
                <span className="label">{challenges.filter((x) => x.category === c).length} challenges</span>
                <strong>{CATEGORIES[c]}</strong>
                <p>{PRACTICE[c]}</p>
              </div>
            ))}
          </div>
        </section>

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
