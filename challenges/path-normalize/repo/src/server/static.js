import { forbidden, notFound, ok } from "../lib/http.js";
import { safeJoin } from "../lib/safePath.js";
import { mimeType } from "./mime.js";

/** Serves one file. urlPath is the raw part of the URL after /static/. */
export function serveStatic(urlPath, { root, files }) {
  let file;
  try {
    file = safeJoin(root, urlPath);
  } catch {
    return forbidden();
  }
  if (!files.has(file)) return notFound();
  return ok(files.get(file), mimeType(file));
}
