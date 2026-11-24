/** "sid=abc; theme=dark" -> { sid: "abc", theme: "dark" } */
export function parseCookies(header) {
  const out = {};
  for (const part of header.split(";")) {
    const [name, value] = part.trim().split("=");
    out[name] = decodeURIComponent(value);
  }
  return out;
}
