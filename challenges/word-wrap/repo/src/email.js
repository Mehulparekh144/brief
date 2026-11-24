import { quote } from "./indent.js";
import { wrap } from "./wrap.js";

const WIDTH = 72;

/** Plain-text body: greeting, wrapped text, optional quoted reply, signature. */
export function plainTextBody({ name, text, replyTo }) {
  const parts = [`Hi ${name},`, wrap(text, WIDTH)];
  if (replyTo) parts.push(quote(wrap(replyTo, WIDTH - 2)));
  parts.push("-- \nThe Team");
  return parts.join("\n\n");
}
