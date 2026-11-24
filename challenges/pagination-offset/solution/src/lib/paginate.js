/**
 * One page of a list. Pages start at 1.
 * Returns { items, page, size, total, totalPages }.
 */
export function paginate(items, page, size) {
  const total = items.length;
  const start = (page - 1) * size;
  return { items: items.slice(start, start + size), page, size, total, totalPages: Math.ceil(total / size) };
}
