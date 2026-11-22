import { applyDiscount } from "../pricing/discounts.js";
import { taxFor } from "../pricing/tax.js";
import { shippingFor } from "../shipping/rates.js";
import { log } from "../util/log.js";
import { subtotal, weight } from "./cart.js";
import { recordOrder } from "./history.js";

/** Prices a cart. Returns every line of the receipt. */
export function checkout(cart, { code, country = "US" } = {}) {
  if (!cart.items.length) throw new Error("cart is empty");
  const sub = subtotal(cart);
  const shipping = shippingFor(weight(cart), country);
  log("checkout", { items: cart.items.length, sub });
  const discount = applyDiscount(sub, code);
  const taxed = taxFor(sub - discount, country);
  const total = Math.round((sub - discount + taxed + shipping) * 100) / 100;
  const order = { subtotal: sub, discount, tax: taxed, shipping, total };
  recordOrder(order);
  return order;
}
