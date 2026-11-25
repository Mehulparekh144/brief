import { fmt, k, vsPar } from "@/lib/format.ts";
import type { Par } from "@/src/challenge.ts";

/** Live token meter: fill to the cap, highlighter band at par. */
export function Meter({ tokens, par, cap }: { tokens: number; par: Par | null; cap: number }) {
  const pct = (n: number) => `${Math.min(100, (n / cap) * 100)}%`;
  const nearCap = tokens >= cap * 0.9;
  const tone = nearCap ? "bad" : !tokens || !par ? "" : tokens > par.high ? "warn" : "good";
  const delta = nearCap ? `${Math.round((tokens / cap) * 100)}% of cap` : vsPar(tokens, par);
  return (
    <div className={`meter ${tone}`} role="meter" aria-label="Tokens used" aria-valuenow={tokens} aria-valuemin={0} aria-valuemax={cap}>
      <div className="meter-row">
        <span className="meter-num">{fmt(tokens)}</span>
        <span className="muted" style={{ fontSize: 12 }}>
          tokens
        </span>
        <span className="meter-delta">{delta}</span>
      </div>
      <div className="meter-bar">
        <span className="fill" style={{ transform: `scaleX(${Math.min(1, tokens / cap)})` }} />
        {par && <span className="par" style={{ left: pct(par.low), width: `max(3px, ${(((par.high - par.low) / cap) * 100).toFixed(2)}%)` }} />}
      </div>
      <div className="meter-scale">
        <span>0</span>
        <span>{par ? `par ${k(par.low)}–${k(par.high)}` : "no par yet"}</span>
        <span>cap {k(cap)}</span>
      </div>
    </div>
  );
}
