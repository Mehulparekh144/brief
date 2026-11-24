import { escapeHtml } from "./template/escape.js";

/** Tiny Markdown: paragraphs split by blank lines, **bold** and `code`. The text is escaped first. */
export function markdown(text) {
  return text
    .split(/\n{2,}/)
    .map((p) => escapeHtml(p.trim()).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, "<code>$1</code>"))
    .map((p) => `<p>${p}</p>`)
    .join("\n");
}
