import { readFileSync } from "node:fs";

/** The parsed JSON config file. A missing file gives {}. */
export function readConfigFile(path, readFile = (p) => readFileSync(p, "utf8")) {
  let text;
  try {
    text = readFile(path);
  } catch (err) {
    if (err.code === "ENOENT") return {};
    throw err;
  }
  return JSON.parse(text);
}
