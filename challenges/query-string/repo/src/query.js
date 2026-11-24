/** "a=1&b=2" -> { a: "1", b: "2" } */
export function parseQuery(str) {
  const out = {};
  for (const pair of str.split("&")) {
    const [key, value] = pair.split("=");
    out[key] = value;
  }
  return out;
}
