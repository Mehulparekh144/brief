/** serializeCookie("sid", "abc", { maxAge: 3600, httpOnly: true }) -> "sid=abc; Max-Age=3600; HttpOnly" */
export function serializeCookie(name, value, { maxAge, path = "/", httpOnly = true, secure = true, sameSite = "Lax" } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (maxAge !== undefined) parts.push(`Max-Age=${Math.floor(maxAge)}`);
  if (path) parts.push(`Path=${path}`);
  if (httpOnly) parts.push("HttpOnly");
  if (secure) parts.push("Secure");
  if (sameSite) parts.push(`SameSite=${sameSite}`);
  return parts.join("; ");
}
