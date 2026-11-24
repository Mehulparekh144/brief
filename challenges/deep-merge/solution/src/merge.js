const isPlain = (v) => v !== null && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype;

// New copies of plain objects and arrays at every depth; other values by reference.
function clone(v) {
  if (Array.isArray(v)) return v.map(clone);
  if (isPlain(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clone(x)]));
  return v;
}

/** Deep-merges source into a copy of target. */
export function merge(target, source) {
  const out = clone(target);
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;
    out[key] = isPlain(value) ? merge(isPlain(out[key]) ? out[key] : {}, value) : clone(value);
  }
  return out;
}
