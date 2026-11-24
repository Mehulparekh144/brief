import { sleep as realSleep } from "./sleep.js";

/**
 * Calls fn up to retries + 1 times, until it succeeds.
 * Before retry i, waits baseMs * 2^i ms, capped at maxMs. Throws the last error.
 */
export async function retry(fn, { retries = 3, baseMs = 100, maxMs = 10_000, sleep = realSleep } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      if (attempt >= retries) throw err;
      await sleep(Math.min(baseMs * 2 ** attempt, maxMs));
    }
  }
}
