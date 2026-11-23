/** Parses "YYYY-MM-DD" (midnight UTC) or a full ISO timestamp. */
export function parseDate(text) {
  const d = new Date(text.length === 10 ? `${text}T00:00:00Z` : text);
  if (Number.isNaN(d.getTime())) throw new Error(`bad date: ${text}`);
  return d;
}

export function toISODate(d) {
  return d.toISOString().slice(0, 10);
}
