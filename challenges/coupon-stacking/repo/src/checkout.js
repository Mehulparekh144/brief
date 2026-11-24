import { subtotalCents, weightG } from "./cart/cart.js";
import { applyCoupons } from "./coupons/apply.js";
import { usableCoupons } from "./coupons/validate.js";
import { shippingCents } from "./shipping/rates.js";

/** Prices a cart. `now` decides which coupons have expired. */
export function checkout(cart, { codes = [], country = "US", now = new Date() } = {}) {
  if (!cart.items.length) throw new Error("cart is empty");
  const items = subtotalCents(cart);
  const shipping = shippingCents(weightG(cart), country, items);
  const coupons = usableCoupons(codes, now);
  return { codes: coupons.map((c) => c.code), subtotal: items, ...applyCoupons({ items, shipping }, coupons) };
}
