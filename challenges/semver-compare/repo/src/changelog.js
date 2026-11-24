/** heading("v1.4.0", new Date("2026-05-01")) -> "## 1.4.0 (2026-05-01)" */
export function heading(tag, date) {
  return `## ${tag.replace(/^v/, "")} (${date.toISOString().slice(0, 10)})`;
}
