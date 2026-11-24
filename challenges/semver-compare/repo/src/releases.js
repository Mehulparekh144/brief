import { compare } from "./semver.js";

/** The newest stable tag, or null. Tags look like "v1.4.0" or "v2.0.0-rc.1". */
export function latestStable(tags) {
  const stable = tags.filter((t) => !t.includes("-"));
  return stable.length ? stable.slice().sort(compare).at(-1) : null;
}
