import { systemClock } from "./clock.js";
import { handle } from "./http/handler.js";
import { rateLimit } from "./http/middleware.js";
import { createRegistry } from "./limits/registry.js";

/** The gateway: (req) => response. */
export function createApp({ now = systemClock } = {}) {
  const limit = rateLimit(createRegistry({ now }));
  return (req) => limit(req, handle);
}

export { createBucket } from "./limits/bucket.js";
