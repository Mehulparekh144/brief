import { EVENTS } from "../events/names.js";

/** Sends "first_add" the first time anything goes into the cart. */
export function trackFirstAdd(bus, send) {
  const onFirst = (items) => send("first_add", { sku: items[0] });
  bus.once(EVENTS.CART_CHANGED, onFirst);
  return () => bus.off(EVENTS.CART_CHANGED, onFirst);
}
