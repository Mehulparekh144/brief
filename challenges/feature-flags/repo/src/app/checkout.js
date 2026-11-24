import { isEnabled } from "../flags/isEnabled.js";

/** Which checkout a user sees. */
export const checkoutVersion = (userId, env) => (isEnabled("new-checkout", userId, env) ? "v2" : "v1");
