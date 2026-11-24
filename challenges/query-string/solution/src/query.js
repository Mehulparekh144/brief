const decode = (s) => {
  const spaced = s.replace(/\+/g, " ");
  try {
    return decodeURIComponent(spaced);
  } catch {
    return spaced;
  }
};

/** "a=1&b=2" -> { a: "1", b: "2" } */
export function parseQuery(str) {
  const out = {};
  for (const piece of str.replace(/^\?/, "").split("&")) {
    if (!piece) continue;
    const i = piece.indexOf("=");
    const key = decode(i < 0 ? piece : piece.slice(0, i));
    if (!key) continue;
    const value = i < 0 ? true : decode(piece.slice(i + 1));
    if (!Object.hasOwn(out, key)) out[key] = value;
    else if (Array.isArray(out[key])) out[key].push(value);
    else out[key] = [out[key], value];
  }
  return out;
}
