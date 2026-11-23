export const roundCents = (n) => Math.round(n * 100) / 100;

export function formatMoney(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}
