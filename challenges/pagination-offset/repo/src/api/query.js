const MAX_SIZE = 50;

/** Reads ?page=&size=&tag= from a query object. Strings in, numbers out. */
export function parseListQuery(query = {}) {
  return {
    page: toInt(query.page, 1),
    size: Math.min(toInt(query.size, 10), MAX_SIZE),
    tag: query.tag || null,
  };
}

function toInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}
