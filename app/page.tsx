import Link from "next/link";
import { BriefRace, type Lane } from "@/components/BriefRace.tsx";
import { DifficultyChip } from "@/components/Bits.tsx";
import { ShimmerLink } from "@/components/ShimmerLink.tsx";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Marquee } from "@/components/ui/marquee";
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

// Real calibration numbers for late-fees (Claude Haiku 5.5, harness v1): lazy median and par.
const PAR = 7685;
const LANES: Lane[] = [
  { label: "Vague brief", brief: "fix the late fee bug", tokens: 16290, note: "2.1× par · read 6 files first", mood: "worried", tone: "warn" },
  {
    label: "Precise brief",
    brief: "In src/billing/lateFee.js, isLate() compares timestamps with >=. Use daysBetween… Run node --test",
    tokens: 7685,
    note: "par · 3 model calls",
    mood: "happy",
    tone: "good",
  },
];

// Bento sizes: the two largest categories take two columns.
const SPAN: Record<Category, string> = { spec: "md:col-span-2", "bug-fix": "md:col-span-2", refactor: "", testing: "", security: "md:col-span-2" };

export default async function Landing({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const me = await currentUser();
  const challenges = listChallenges().map(loadChallenge);
  const { error } = await searchParams;
  const cta = me?.approved ? { href: "/challenges", label: "Go to practice" } : me ? { href: "/waitlist", label: "You are on the waitlist" } : { href: "/auth/login", label: "Sign in with GitHub" };
  return (
    <>
      <Topbar me={me} />
      <main className="page landing">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(challenges.length) }} />
        {error === "signin" && <p className="notice bad">Sign-in did not finish. Try again.</p>}

        <section className="hero relative">
          <DotPattern className="hero-dots text-[var(--line)]" width={22} height={22} cr={1.2} />
          <div className="hero-text">
            <Logo big />
            <AnimatedShinyText className="label mx-0 justify-start">Practice range for AI coding agents</AnimatedShinyText>
            <h1>
              Same fix. <mark>Half the tokens.</mark>
            </h1>
            <p>
              You brief an AI agent on a real coding task. A live meter counts every token. Hidden tests check the result. Then Brie, your coach, shows where
              the tokens went and how to say it better.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ShimmerLink href={cta.href}>{cta.label}</ShimmerLink>
              <Button asChild variant="ghost" size="lg">
                <a href="#how">How it works</a>
              </Button>
            </div>
          </div>
          <Card className="race-card relative px-5">
            <span className="label">The same bug, two briefs · measured</span>
            <BriefRace lanes={LANES} par={PAR} />
            <p className="text-xs text-muted-foreground">Claude Haiku 5.5 · both briefs passed the hidden tests · the band is par.</p>
            <BorderBeam size={90} duration={9} colorFrom="#F7E36A" colorTo="#C9AE00" />
          </Card>
          <figure className="hero-brie">
            <Brie mood="happy" size={120} />
            <figcaption className="bubble">Hi, I&apos;m Brie. Send a clear brief, and I&apos;ll show you where every token went.</figcaption>
          </figure>
        </section>

        <Marquee pauseOnHover className="marquee [--duration:60s] [--gap:0.75rem]" aria-label={`${challenges.length} challenges`}>
          {challenges.map((c) => (
            <span key={c.slug} className="marquee-item">
              {c.title}
              <DifficultyChip level={c.difficulty} />
            </span>
          ))}
        </Marquee>

        <ol id="how" className="loop" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            ["Step 1", "Brief", "Read the task and the code. Reading is free. Every message you send costs tokens."],
            ["Step 2", "Run", "The agent edits code and runs tests in a private sandbox. The meter counts every token, live."],
            ["Step 3", "Debrief", "Hidden tests grade the work. Brie shows the cost of each message. Try again and beat par."],
          ].map(([step, title, text], i) => (
            <li key={step}>
              <Card className="h-full px-5">
                <span className="label">{step}</span>
                <strong className="text-lg">{i === 0 ? <mark>{title}</mark> : title}</strong>
                <p>{text}</p>
              </Card>
            </li>
          ))}
        </ol>

        <section className="grid gap-3">
          <h2>What you practice</h2>
          <p className="muted">
            {challenges.length} challenges in JavaScript and Python, from easy to hard. Each one teaches one briefing skill.
          </p>
          <div className="loop bento">
            {(Object.keys(CATEGORIES) as Category[]).map((c) => (
              <Card key={c} className={`px-5 ${SPAN[c]}`}>
                <span className="label">{challenges.filter((x) => x.category === c).length} challenges</span>
                <strong className="text-lg">{CATEGORIES[c]}</strong>
                <p>{PRACTICE[c]}</p>
              </Card>
            ))}
          </div>
        </section>

        <p className="muted" style={{ fontSize: 12 }}>
          Brieflab is a private beta. We save your sessions and use them to improve the product. Ask us and we delete your data.
        </p>
      </main>
    </>
  );
}
