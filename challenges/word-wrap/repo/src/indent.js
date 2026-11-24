/** Adds `prefix` to the start of every line. */
export function indent(text, prefix = "  ") {
  return text
    .split("\n")
    .map((line) => (line ? prefix + line : line))
    .join("\n");
}

/** Email-style quote: "> " before every line. */
export const quote = (text) => indent(text, "> ");
