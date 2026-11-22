// Discount codes. Rates are fractions of the subtotal.
const DISCOUNTS = {
  save10: { rate: 0.1, minSubtotal: 0 },
  save25: { rate: 0.25, minSubtotal: 100 },
  welcome5: { rate: 0.05, minSubtotal: 0 },
};

/** Discount amount in dollars for a code. No code: 0. */
export function applyDiscount(subtotal, code) {
  const d = DISCOUNTS[String(code ?? "").trim().toLowerCase()];
  if (!d || subtotal < d.minSubtotal) return 0;
  return Math.round(subtotal * d.rate * 100) / 100;
}
