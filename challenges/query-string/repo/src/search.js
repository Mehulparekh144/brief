import { parseQuery } from "./query.js";

const PAGE_SIZE = 20;

/** Search options from a URL like "/search?q=shoes&page=2". */
export function searchOptions(url) {
  const i = url.indexOf("?");
  const q = i < 0 ? {} : parseQuery(url.slice(i));
  const page = Math.max(1, Number.parseInt(q.page, 10) || 1);
  return { text: q.q ?? "", offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
}
