/** True when `path` matches the glob `pattern`. */
export function match(pattern, path) {
  const re = pattern.replace(/\*/g, ".*").replace(/\?/g, ".");
  return new RegExp(re).test(path);
}
