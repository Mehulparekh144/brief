import { config } from "./config.js";

const round = (n) => Math.round(n * 100) / 100;

/** Sum of price × qty, plus tax. */
export function calcTotal(items, { currency = config.currency, taxRate = config.taxRate } = {}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { amount: round(subtotal * (1 + taxRate)), currency };
}
