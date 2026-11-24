import path from "node:path";

/**
 * Joins a user-supplied relative path onto root.
 * Throws if the result would leave root.
 */
export function safeJoin(root, userPath) {
  const full = path.resolve(root, userPath);
  if (!full.startsWith(root)) throw new Error(`forbidden path: ${userPath}`);
  return full;
}
