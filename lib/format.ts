import type { Par } from "@/src/challenge.ts";

export const PAR_TEXT =
  "Par is the token count of a good brief. We solved each challenge with one clear first message, 3 times, on the same model you use. The range is our lowest to highest run. Like golf: fewer is better. Finish under par and you briefed better than our reference.";

const LEVELS = { easy: 0, medium: 1, hard: 2 } as const;
export const byDifficulty = (a: { difficulty: keyof typeof LEVELS; title: string }, b: { difficulty: keyof typeof LEVELS; title: string }) =>
  LEVELS[a.difficulty] - LEVELS[b.difficulty] || a.title.localeCompare(b.title);

export { fmt, k } from "@/src/meter.ts";
import { k } from "@/src/meter.ts";
export const parRange = (p: Par | null | undefined) => (p ? `${k(p.low)}–${k(p.high)}` : "not set");

/** "+26% over par" / "12% under par" / "" */
export function vsPar(tokens: number, par: Par | null | undefined): string {
  if (!par || !tokens) return "";
  const pct = Math.round((tokens / par.median - 1) * 100);
  return pct > 0 ? `+${pct}% over par` : `${-pct}% under par`;
}

/** Result label from the plan: Under par / Within 25% of par / Over par. */
export function verdict(tokens: number, par: Par | null | undefined): { label: string; tone: "good" | "warn" | "" } {
  if (!par) return { label: "No par yet", tone: "" };
  if (tokens <= par.median) return { label: "Under par", tone: "good" };
  if (tokens <= par.median * 1.25) return { label: "Within 25% of par", tone: "good" };
  return { label: "Over par", tone: "warn" };
}
