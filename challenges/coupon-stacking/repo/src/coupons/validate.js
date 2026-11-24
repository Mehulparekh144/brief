import { COUPONS } from "./catalog.js";

/**
 * The coupons for these codes that exist and have not expired on `now`.
 * Codes ignore case and spaces. Unknown codes and repeats are skipped.
 */
export function usableCoupons(codes, now) {
  const today = now.toISOString().slice(0, 10);
  const seen = new Set();
  const out = [];
  for (const raw of codes) {
    const code = raw.trim().toUpperCase();
    const coupon = COUPONS[code];
    if (!coupon || seen.has(code) || coupon.expires < today) continue;
    seen.add(code);
    out.push({ code, ...coupon });
  }
  return out;
}
