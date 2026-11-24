import { trackFirstAdd } from "./analytics/track.js";
import { Emitter } from "./events/emitter.js";
import { createCartStore } from "./store/cart.js";
import { mountBadge } from "./ui/badge.js";

/** Wires the page: analytics first, then the badge. */
export function createPage({ send }) {
  const bus = new Emitter();
  trackFirstAdd(bus, send);
  const badge = mountBadge(bus);
  const cart = createCartStore(bus);
  return { bus, badge, cart };
}

export { Emitter };
