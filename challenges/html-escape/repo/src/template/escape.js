/** Makes text safe to put in HTML. */
export function escapeHtml(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
