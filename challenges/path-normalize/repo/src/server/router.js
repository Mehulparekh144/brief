import { notAllowed, notFound } from "../lib/http.js";
import { serveStatic } from "./static.js";

const PREFIX = "/static/";

export function route(req, deps) {
  if (req.method !== "GET") return notAllowed();
  const url = req.url.split("?")[0];
  if (url.startsWith(PREFIX)) return serveStatic(url.slice(PREFIX.length), deps);
  return notFound();
}
