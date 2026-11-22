import { findProduct } from "../catalog/products.js";

export const createCart = () => ({ items: [] });

export function addItem(cart, sku, qty = 1) {
  if (!(qty > 0)) throw new Error("qty must be positive");
  const product = findProduct(sku);
  const line = cart.items.find((i) => i.sku === sku);
  if (line) line.qty += qty;
  else cart.items.push({ sku, qty, price: product.price, weightKg: product.weightKg });
  return cart;
}

export function removeItem(cart, sku) {
  cart.items = cart.items.filter((i) => i.sku !== sku);
  return cart;
}

export const subtotal = (cart) => Math.round(cart.items.reduce((s, i) => s + i.price * i.qty, 0) * 100) / 100;
export const weight = (cart) => cart.items.reduce((s, i) => s + i.weightKg * i.qty, 0);
