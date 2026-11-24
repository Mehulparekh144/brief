import path from "node:path";

/**
 * Joins a user-supplied relative path onto root.
 * The path is percent-decoded once. Absolute paths and ".." segments throw.
 */
export function safeJoin(root, userPath) {
  const decoded = decodeURIComponent(userPath);
  if (path.isAbsolute(decoded) || decoded.split("/").includes("..")) throw new Error(`forbidden path: ${userPath}`);
  const base = path.resolve(root);
  const full = path.resolve(base, decoded);
  if (!full.startsWith(base + path.sep)) throw new Error(`forbidden path: ${userPath}`);
  return full;
}
