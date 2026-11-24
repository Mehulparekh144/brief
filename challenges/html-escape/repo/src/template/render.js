import { escapeHtml } from "./escape.js";

/**
 * Fills a template.
 * {{key}} inserts data[key], HTML-escaped.
 * {{{key}}} inserts data[key] as HTML.
 */
export function render(template, data) {
  return template
    .replace(/\{\{\{(\w+)\}\}\}/g, (_, key) => String(data[key]))
    .replace(/\{\{(\w+)\}\}/g, (_, key) => escapeHtml(String(data[key])));
}
