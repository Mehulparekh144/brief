import { listProducts } from "./products.js";

/** Case-insensitive name search. */
export function search(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return listProducts().filter((p) => p.name.toLowerCase().includes(q));
}
