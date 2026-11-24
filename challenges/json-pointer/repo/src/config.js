import { readFileSync } from "node:fs";
import { get } from "./pointer.js";

/** The `config get <file> <pointer>` command: prints the value as JSON, or "not set". */
export function configGet(file, pointer) {
  const value = get(JSON.parse(readFileSync(file, "utf8")), pointer);
  return value === undefined ? `${pointer}: not set` : JSON.stringify(value);
}
