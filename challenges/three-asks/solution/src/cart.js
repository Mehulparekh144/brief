import { config } from "./config.js";

const round = (n) => Math.round(n * 100) / 100;

/** Sum of price × qty, minus the discount, plus tax. */
export function calculateTotal(items, { currency = config.currency, taxRate = config.taxRate, discount = 0 } = {}) {
  if (!(discount >= 0 && discount <= 1)) throw new Error("discount must be between 0 and 1");
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { amount: round(subtotal * (1 - discount) * (1 + taxRate)), currency };
}
