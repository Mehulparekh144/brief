/** Reads the value at `pointer` (RFC 6901 JSON Pointer) in `doc`. */
export function get(doc, pointer) {
  return pointer
    .split("/")
    .slice(1)
    .reduce((node, key) => (node == null ? undefined : node[key]), doc);
}
