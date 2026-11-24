import { toRoman } from "./roman.js";

export function copyrightLine(year = new Date().getUTCFullYear(), owner = "Quill Press") {
  return `© ${toRoman(year)} ${owner}`;
}
