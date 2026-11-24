import { toRoman } from "./roman.js";

/** chapterHeading(4, "The Storm") -> "Chapter IV: The Storm" */
export function chapterHeading(n, title) {
  return `Chapter ${toRoman(n)}: ${title}`;
}
