import type Anthropic from "@anthropic-ai/sdk";

// Claude Haiku 5.5 list prices in USD per million tokens, for prompts up to 100k tokens.
// shortcut: cache prices assume the usual 1.25x write / 0.1x read; confirm on the pricing page before trusting $ figures.
export const PRICE = { input: 0.1, cacheWrite: 0.125, cacheRead: 0.01, output: 0.5 };

export type Tally = { input: number; cacheWrite: number; cacheRead: number; output: number; calls: number };

export const emptyTally = (): Tally => ({ input: 0, cacheWrite: 0, cacheRead: 0, output: 0, calls: 0 });

/** Input tokens the model read in one call: uncached + written to cache + read from cache. */
export const promptSize = (u: Anthropic.Usage) =>
  u.input_tokens + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);

/** Every token one call processed. Output includes thinking. */
export const callTotal = (u: Anthropic.Usage) => promptSize(u) + u.output_tokens;

export function add(t: Tally, u: Anthropic.Usage): void {
  t.input += u.input_tokens;
  t.cacheWrite += u.cache_creation_input_tokens ?? 0;
  t.cacheRead += u.cache_read_input_tokens ?? 0;
  t.output += u.output_tokens;
  t.calls += 1;
}

/** The number on the meter. */
export const total = (t: Tally) => t.input + t.cacheWrite + t.cacheRead + t.output;

export const cost = (t: Tally) =>
  (t.input * PRICE.input + t.cacheWrite * PRICE.cacheWrite + t.cacheRead * PRICE.cacheRead + t.output * PRICE.output) / 1e6;

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
export const k = (n: number) => `${(n / 1000).toFixed(1)}k`;

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
