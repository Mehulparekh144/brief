/**
 * One page of a list.
 * Returns { items, page, size, total, totalPages }.
 */
export function paginate(items, page, size) {
  const total = items.length;
  const totalPages = Math.floor(total / size);
  const current = Math.min(page, totalPages); // never go past the last page
  const start = current * size;
  return { items: items.slice(start, start + size), page: current, size, total, totalPages };
}
