import { systemClock } from "../clock.js";
import { createBucket } from "./bucket.js";
import { PLANS } from "./plans.js";

/** One bucket per API key, made on first use. */
export function createRegistry({ now = systemClock } = {}) {
  const buckets = new Map();
  return {
    bucketFor(key, plan = "free") {
      if (!buckets.has(key)) buckets.set(key, createBucket({ ...PLANS[plan], now }));
      return buckets.get(key);
    },
  };
}
