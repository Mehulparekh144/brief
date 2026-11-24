import { total } from "./cart.js";

const euros = (cents) => `€${(cents / 100).toFixed(2)}`;

/** The lines of the order summary page. */
export function summary(cart) {
  const lines = cart.items.map((it) => `${it.qty} × ${it.sku}  ${euros(it.price * it.qty)}`);
  if (cart.coupon) lines.push(`Coupon ${cart.coupon}`);
  lines.push(`Total  ${euros(total(cart))}`);
  return lines;
}
