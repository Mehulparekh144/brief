import { StartButton } from "@/components/StartButton.tsx";
import { Topbar } from "@/components/Topbar.tsx";
import { requireUser } from "@/lib/auth.ts";
import { DifficultyChip } from "@/components/Bits.tsx";
import { LinkTabs } from "@/components/LinkTabs.tsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { byDifficulty, fmt, PAR_TEXT, parRange, staleBefore } from "@/lib/format.ts";
import Link from "next/link";

import { db } from "@/lib/supabase.ts";
import { CATEGORIES, type Category, listChallenges, loadChallenge } from "@/src/challenge.ts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Practice" };

export default async function ChallengesPage({ searchParams }: { searchParams: Promise<{ error?: string; category?: string }> }) {
  const me = await requireUser();
  const { error, category } = await searchParams;
  const active = category && category in CATEGORIES ? (category as Category) : null;
  const { data: open } = await db().from("sessions").select("id, challenge").eq("user_id", me.id).eq("status", "active").gte("heartbeat_at", staleBefore()).order("started_at", { ascending: false }).limit(1);
  const running = open?.[0] ? { id: open[0].id, title: loadChallenge(open[0].challenge).title } : null;
  const all = listChallenges().map(loadChallenge).sort(byDifficulty);
  const challenges = active ? all.filter((c) => c.category === active) : all;
  const count = (c: Category) => all.filter((x) => x.category === c).length;
  const { data: rows } = await db().from("sessions").select("challenge, tokens_total, passed").eq("user_id", me.id).eq("status", "submitted");
  const best = new Map<string, { best: number | null; tries: number }>();
  for (const r of rows ?? []) {
    const b = best.get(r.challenge) ?? { best: null, tries: 0 };
    b.tries += 1;
    if (r.passed && (b.best === null || r.tokens_total < b.best)) b.best = r.tokens_total;
    best.set(r.challenge, b);
  }

  return (
    <>
      <Topbar me={me} />
      <main className="page">
        <header style={{ display: "grid", gap: 6 }}>
          <p className="label">Practice</p>
          <h1>Pick a task. Brief the agent. Beat par.</h1>
          <p className="muted">Reading the code is free. Every message you send costs tokens.</p>
        </header>
        <div className="notice par-explainer">
          <b>What is par?</b>
          <span>{PAR_TEXT}</span>
        </div>
        {running && (
          <div className="notice resume">
            <span>
              Your <b>{running.title}</b> session is still open. Finish or submit it before you start another one.
            </span>
            <Button asChild>
              <Link href={`/s/${running.id}`}>Resume</Link>
            </Button>
          </div>
        )}
        {error && <p className="notice bad">{error}</p>}
        <LinkTabs
          label="Categories"
          value={active ?? "all"}
          tabs={[
            { value: "all", label: "All", href: "/challenges", count: all.length },
            ...(Object.keys(CATEGORIES) as Category[]).map((c) => ({ value: c, label: CATEGORIES[c], href: `/challenges?category=${c}`, count: count(c) })),
          ]}
        />
        <div className="ch-list">
          {challenges.map((ch, i) => {
            const b = best.get(ch.slug);
            return (
              <Card key={ch.slug} className="ch-row grid px-5" style={{ "--i": Math.min(i, 12) } as React.CSSProperties}>
                <div style={{ display: "grid", gap: 4 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <h3>{ch.title}</h3>
                    <DifficultyChip level={ch.difficulty} />
                    <Badge variant="secondary" className="font-num">
                      {CATEGORIES[ch.category]}
                    </Badge>
                  </div>
                  <p className="muted">{ch.statement.split("\n")[0]}</p>
                  <span className="label">Skill: {ch.skill}</span>
                </div>
                <div className="num" style={{ fontSize: 12 }}>
                  <span className="label">Par</span>
                  <br />
                  {parRange(ch.par)}
                </div>
                <div className="num" style={{ fontSize: 12 }}>
                  <span className="label">Your best</span>
                  <br />
                  {b?.best != null ? fmt(b.best) : b?.tries ? `${b.tries} tries` : "—"}
                </div>
                <StartButton slug={ch.slug} label={b?.tries ? "Try again" : "Start"} />
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
