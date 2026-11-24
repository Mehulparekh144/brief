/** Deep-merges source into target. */
export function merge(target, source) {
  for (const key of Object.keys(source)) {
    const value = source[key];
    if (Array.isArray(value) && Array.isArray(target[key])) {
      target[key] = target[key].concat(value);
    } else if (value && typeof value === "object") {
      target[key] = merge(target[key] ?? {}, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}
