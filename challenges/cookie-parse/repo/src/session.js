import { parseCookies } from "./cookies.js";
import { serializeCookie } from "./serialize.js";

export const SESSION_COOKIE = "sid";

/** The session id from the request, or null. */
export function sessionId(req) {
  return parseCookies(req.headers.cookie)[SESSION_COOKIE] ?? null;
}

export function sessionCookie(id) {
  return serializeCookie(SESSION_COOKIE, id, { maxAge: 7 * 24 * 3600 });
}
