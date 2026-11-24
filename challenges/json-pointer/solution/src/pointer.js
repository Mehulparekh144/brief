const INDEX = /^(0|[1-9][0-9]*)$/;

/** Reads the value at `pointer` (RFC 6901 JSON Pointer) in `doc`. A path that does not exist gives undefined. */
export function get(doc, pointer) {
  if (pointer === "") return doc;
  if (typeof pointer !== "string" || !pointer.startsWith("/")) throw new SyntaxError(`JSON pointer must start with "/": ${pointer}`);
  if (/~(?![01])/.test(pointer)) throw new SyntaxError(`bad "~" escape in JSON pointer: ${pointer}`);
  let node = doc;
  for (const part of pointer.slice(1).split("/")) {
    const key = part.replace(/~1/g, "/").replace(/~0/g, "~");
    if (Array.isArray(node)) {
      if (key === "-") throw new RangeError(`"-" points past the end of the array: ${pointer}`);
      if (!INDEX.test(key)) return undefined;
      node = node[Number(key)];
    } else if (node !== null && typeof node === "object" && Object.hasOwn(node, key)) {
      node = node[key];
    } else {
      return undefined;
    }
  }
  return node;
}
