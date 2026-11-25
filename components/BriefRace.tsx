"use client";
import type { BrieMood } from "@/lib/format.ts";
import { Brie } from "./Brie.tsx";
import { Count } from "./Count.tsx";

export type Lane = { label: string; brief: string; tokens: number; note: string; mood: BrieMood; tone: "good" | "warn" };

/** The landing page's "brief race": the same bug, two briefs, two meters filling up against par. */
export function BriefRace({ lanes, par }: { lanes: Lane[]; par: number }) {
  const max = Math.max(...lanes.map((l) => l.tokens), par) * 1.1;
  return (
    <div className="race" aria-label="The same bug fixed with two briefs">
      {lanes.map((l) => (
        <div key={l.label} className="race-lane">
          <div className="flex items-start gap-3">
            <Brie mood={l.mood} size={36} />
            <div className="grid min-w-0 gap-1">
              <span className="label">{l.label}</span>
              <code className="race-brief">{l.brief}</code>
            </div>
          </div>
          <div className="race-bar">
            <span
              className={`race-fill ${l.tone}`}
              style={{ "--x": l.tokens / max, animationDuration: `${0.5 + 1.6 * (l.tokens / max)}s` } as React.CSSProperties}
            />
            <span className="race-par" style={{ left: `${(par / max) * 100}%` }} title={`Par ${par.toLocaleString("en-US")} tokens`} />
          </div>
          <div className="flex items-baseline justify-between gap-3 font-num text-xs">
            <span>
              <Count value={l.tokens} className="text-base font-semibold" /> tokens
            </span>
            <span className={l.tone === "good" ? "text-good" : "text-warn"}>{l.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
