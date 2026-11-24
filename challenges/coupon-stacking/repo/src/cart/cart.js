import { PRODUCTS } from "../catalog/products.js";

export const createCart = () => ({ items: [] });

export function addItem(cart, sku, qty = 1) {
  if (!PRODUCTS[sku]) throw new Error(`unknown product ${sku}`);
  return { items: [...cart.items, { sku, qty }] };
}

export const subtotalCents = (cart) => cart.items.reduce((sum, i) => sum + PRODUCTS[i.sku].priceCents * i.qty, 0);

export const weightG = (cart) => cart.items.reduce((sum, i) => sum + PRODUCTS[i.sku].weightG * i.qty, 0);
