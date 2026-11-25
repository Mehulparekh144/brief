import type { ReactNode } from "react";
import type { BrieMood } from "@/lib/format.ts";

// Brie, the Brieflab mascot: a briefing card. Her mood follows the token meter (moodFor in lib/format.ts).

const INK = "#14181D";
const line = { fill: "none", stroke: INK, strokeWidth: 4, strokeLinecap: "round" as const };

const FACES: Record<BrieMood, ReactNode> = {
  neutral: (
    <>
      <circle cx="48" cy="58" r="4.5" fill={INK} />
      <circle cx="72" cy="58" r="4.5" fill={INK} />
      <path d="M53 70 q7 5 14 0" {...line} />
    </>
  ),
  happy: (
    <>
      <path d="M42 58 q6 -8 12 0 M66 58 q6 -8 12 0" {...line} />
      <path d="M51 69 q9 9 18 0" {...line} />
      <circle cx="38" cy="68" r="5" fill="#F2A93B" opacity=".45" />
      <circle cx="82" cy="68" r="5" fill="#F2A93B" opacity=".45" />
    </>
  ),
  worried: (
    <>
      <path d="M40 50 L54 46 M80 50 L66 46" {...line} />
      <circle cx="48" cy="59" r="4.5" fill={INK} />
      <circle cx="72" cy="59" r="4.5" fill={INK} />
      <path d="M53 75 q7 -6 14 0" {...line} />
      <path d="M92 50 q4 7 0 10 q-4 -3 0 -10 Z" fill="#8FC9F2" stroke={INK} strokeWidth="2" />
    </>
  ),
  shocked: (
    <>
      <circle cx="48" cy="57" r="7" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <circle cx="72" cy="57" r="7" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <circle cx="48" cy="58" r="3" fill={INK} />
      <circle cx="72" cy="58" r="3" fill={INK} />
      <ellipse cx="60" cy="76" rx="6" ry="7" fill={INK} />
    </>
  ),
  thinking: (
    <>
      <circle cx="51" cy="54" r="4.5" fill={INK} />
      <circle cx="75" cy="54" r="4.5" fill={INK} />
      <path d="M54 72 H66" {...line} />
      <circle cx="36" cy="88" r="2.5" fill={INK} opacity=".5" />
      <circle cx="44" cy="88" r="2.5" fill={INK} opacity=".5" />
      <circle cx="52" cy="88" r="2.5" fill={INK} opacity=".5" />
    </>
  ),
};

const LABEL: Record<BrieMood, string> = {
  neutral: "Brie",
  happy: "Brie, happy",
  worried: "Brie, worried",
  shocked: "Brie, shocked",
  thinking: "Brie, thinking",
};

export function Brie({ mood = "neutral", size = 48, decorative = false }: { mood?: BrieMood; size?: number; decorative?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`brie brie-${mood}`}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : LABEL[mood]}
    >
      <path d="M32 22 H80 L100 42 V90 a12 12 0 0 1 -12 12 H32 a12 12 0 0 1 -12 -12 V34 a12 12 0 0 1 12 -12 Z" fill="#F7E36A" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M80 22 V42 H100 Z" fill="#D9BE3A" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {FACES[mood]}
      {mood !== "thinking" && <path d="M36 88 H70 M36 95 H58" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity=".25" />}
    </svg>
  );
}

/** Logo lockup: Brie's mark + the "brieflab" wordmark. */
export function Logo({ big = false }: { big?: boolean }) {
  return (
    <span className={`logo ${big ? "big" : ""}`}>
      <Brie size={big ? 64 : 26} decorative />
      <span className={`wm ${big ? "big" : ""}`}>
        <b>brief</b>lab
      </span>
    </span>
  );
}
