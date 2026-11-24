import { EVENTS } from "../events/names.js";

/** Cart state. Every change emits CART_CHANGED with the item list. */
export function createCartStore(bus) {
  let items = [];
  return {
    add(sku) {
      items = [...items, sku];
      bus.emit(EVENTS.CART_CHANGED, items);
    },
    remove(sku) {
      items = items.filter((s) => s !== sku);
      bus.emit(EVENTS.CART_CHANGED, items);
    },
    items: () => items,
  };
}
