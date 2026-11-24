// A cart is { items: [{ sku, price, qty }], coupon: null | "CODE" }. Prices are integer cents.
// The functions never change the cart they get. They return a new cart.
const COUPONS = { SAVE10: { percent: 10 }, FIVEOFF: { cents: 500 } };

export function addItem(cart, { sku, price, qty = 1 }) {
  if (!Number.isInteger(qty) || qty < 1) throw new RangeError(`qty must be a whole number above 0, got ${qty}`);
  const found = cart.items.some((it) => it.sku === sku);
  const items = found
    ? cart.items.map((it) => (it.sku === sku ? { ...it, qty: it.qty + qty } : it))
    : [...cart.items, { sku, price, qty }];
  return { ...cart, items };
}

export function removeItem(cart, sku) {
  return { ...cart, items: cart.items.filter((it) => it.sku !== sku) };
}

export function applyCoupon(cart, code) {
  const key = String(code).trim().toUpperCase();
  if (!Object.hasOwn(COUPONS, key)) throw new Error(`unknown coupon: ${code}`);
  return { ...cart, coupon: key };
}

export function total(cart) {
  const subtotal = cart.items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const coupon = cart.coupon && COUPONS[cart.coupon];
  if (!coupon) return subtotal;
  const discount = coupon.percent ? Math.round((subtotal * coupon.percent) / 100) : coupon.cents;
  return Math.max(0, subtotal - discount);
}
