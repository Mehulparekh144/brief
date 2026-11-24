import { isEnabled } from "../flags/isEnabled.js";

/** Which search backend serves a user. */
export const searchBackend = (userId, env) => (isEnabled("beta-search", userId, env) ? "vector" : "keyword");
