import { systemClock } from "../clock.js";

/**
 * Token bucket. Starts full, holds at most `capacity` tokens.
 * `now()` is in ms; `refillPerSec` is tokens per second. Each allowed request takes one token.
 */
export function createBucket({ capacity, refillPerSec, now = systemClock }) {
  let tokens = capacity;
  let last = now();

  function refill() {
    const t = now();
    tokens = Math.min(capacity, tokens + ((t - last) / 1000) * refillPerSec);
    last = t;
  }

  return {
    allow() {
      refill();
      if (tokens < 1) return false;
      tokens -= 1;
      return true;
    },
    available() {
      refill();
      return tokens;
    },
  };
}
