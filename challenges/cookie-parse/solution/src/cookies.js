/** "sid=abc; theme=dark" -> { sid: "abc", theme: "dark" } */
export function parseCookies(header) {
  const out = {};
  if (typeof header !== "string") return out;
  for (const pair of header.split(";")) {
    const i = pair.indexOf("=");
    if (i < 0) continue;
    const name = pair.slice(0, i).trim();
    // hasOwn, not `in`: names like "toString" exist on every object's prototype.
    if (!name || Object.hasOwn(out, name)) continue;
    let value = pair.slice(i + 1).trim();
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    try {
      value = decodeURIComponent(value);
    } catch {
      // keep the raw value
    }
    out[name] = value;
  }
  return out;
}
