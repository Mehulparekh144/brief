const BASE = { US: 499, CA: 899, DE: 1299 };
const FREE_FROM = 5000; // US orders from $50 ship free

/** Shipping in cents: a base per country plus 100 per started 500 g. */
export function shippingCents(weightG, country, itemsCents) {
  if (country === "US" && itemsCents >= FREE_FROM) return 0;
  const base = BASE[country];
  if (base === undefined) throw new Error(`no shipping to ${country}`);
  return base + Math.ceil(weightG / 500) * 100;
}
