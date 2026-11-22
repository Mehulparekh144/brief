import { calcTotal } from "./cart.js";
import { formatTotal } from "./format.js";

export function checkout(cart, user) {
  if (!cart.items.length) throw new Error("cart is empty");
  const total = calcTotal(cart.items);
  return { user: user.id, ...total, label: formatTotal(total) };
}
