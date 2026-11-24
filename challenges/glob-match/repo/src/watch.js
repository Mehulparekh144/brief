import { WATCH } from "./config.js";
import { match } from "./glob.js";

/** Returns the changed paths that match at least one pattern, in the same order. */
export function filterChanged(paths, patterns = WATCH) {
  return paths.filter((path) => patterns.some((pattern) => match(pattern, path)));
}
