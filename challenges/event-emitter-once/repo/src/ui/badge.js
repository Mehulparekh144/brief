import { EVENTS } from "../events/names.js";

/** The item count on the cart icon. */
export function mountBadge(bus) {
  const state = { count: 0 };
  const update = (items) => {
    state.count = items.length;
  };
  bus.on(EVENTS.CART_CHANGED, update);
  return { state, unmount: () => bus.off(EVENTS.CART_CHANGED, update) };
}
