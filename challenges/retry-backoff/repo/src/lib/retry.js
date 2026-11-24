import { sleep as realSleep } from "./sleep.js";

/**
 * Calls fn until it succeeds.
 * Waits between attempts with exponential backoff.
 */
export async function retry(fn, { retries = 3, baseMs = 100, maxMs = 10_000, sleep = realSleep } = {}) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;
      await sleep(Math.min(baseMs * (attempt + 1), maxMs));
    }
  }
  throw new Error(`gave up after ${retries} attempts`, { cause: lastError });
}
