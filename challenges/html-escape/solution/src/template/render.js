import { escapeHtml } from "./escape.js";

/**
 * Fills a template in one pass, so inserted values are never scanned again.
 * {{key}} inserts data[key], HTML-escaped.
 * {{{key}}} inserts data[key] as HTML only when key is in allowRaw; otherwise it is escaped.
 * undefined and null render as "".
 */
export function render(template, data, { allowRaw = [] } = {}) {
  return template.replace(/\{\{\{(\w+)\}\}\}|\{\{(\w+)\}\}/g, (_, rawKey, key) => {
    const value = data[rawKey ?? key];
    const text = value == null ? "" : String(value);
    return rawKey && allowRaw.includes(rawKey) ? text : escapeHtml(text);
  });
}
