const sum = (coupons, type) => coupons.filter((c) => c.type === type).reduce((s, c) => s + c.value, 0);

/**
 * Applies coupons to an order. All amounts are in cents.
 * order: { items, shipping }. Returns { items, shipping, total }.
 * Best percent coupon first, then fixed coupons; shipping coupons touch only shipping. Nothing goes below 0.
 */
export function applyCoupons(order, coupons) {
  const percent = Math.max(0, ...coupons.filter((c) => c.type === "percent").map((c) => c.value));
  const afterPercent = order.items - Math.round((order.items * percent) / 100);
  const items = Math.max(0, afterPercent - sum(coupons, "fixed"));
  const shipping = Math.max(0, order.shipping - sum(coupons, "shipping"));
  return { items, shipping, total: items + shipping };
}
