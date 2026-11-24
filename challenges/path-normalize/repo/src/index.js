import { STATIC_ROOT } from "./config.js";
import { route } from "./server/router.js";

/** The server: (req) => response. `files` maps absolute paths to contents (a real fs in production). */
export function createServer({ root = STATIC_ROOT, files }) {
  return (req) => route(req, { root, files });
}

export { safeJoin } from "./lib/safePath.js";
