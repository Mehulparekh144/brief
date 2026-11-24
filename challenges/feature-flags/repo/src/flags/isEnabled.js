import { FLAGS } from "./config.js";
import { envName } from "./env.js";
import { fnv1a } from "./hash.js";

/** Bucket 0-99 for a flag and user. Stable: same input, same bucket. */
export const bucket = (flag, userId) => fnv1a(`${flag}:${userId}`) % 100;

/**
 * True when the flag is on for this user.
 * env can force a flag on: FLAG_NEW_CHECKOUT=on.
 */
export function isEnabled(flag, userId, env = process.env) {
  const def = FLAGS[flag];
  if (!def) return false;
  if (env[envName(flag)] === "on") return true;
  return bucket(flag, userId) >= def.rollout;
}
