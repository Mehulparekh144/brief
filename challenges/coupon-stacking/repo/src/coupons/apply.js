/**
 * Applies coupons to an order. All amounts are in cents.
 * order: { items, shipping }. Returns { items, shipping, total }.
 */
export function applyCoupons(order, coupons) {
  let { items, shipping } = order;
  for (const c of coupons) {
    if (c.type === "percent") items -= Math.round((items * c.value) / 100);
    else items -= c.value; // fixed and shipping coupons are flat amounts
  }
  return { items, shipping, total: items + shipping };
}
