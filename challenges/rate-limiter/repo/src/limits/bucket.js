import { systemClock } from "../clock.js";

/** Token bucket. Starts full. Each request takes one token. */
export function createBucket({ capacity, refillPerSec, now = systemClock }) {
  let tokens = capacity;
  let last = now();

  function refill() {
    const t = now();
    tokens += (t - last) * refillPerSec;
    last = t;
  }

  return {
    allow() {
      refill();
      if (tokens <= 0) return false;
      tokens -= 1;
      return true;
    },
    available() {
      refill();
      return tokens;
    },
  };
}
