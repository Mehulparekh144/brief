const PER_USD = { USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.36 };

export function convert(amountUsd, currency) {
  const rate = PER_USD[currency];
  if (!rate) throw new Error(`unsupported currency: ${currency}`);
  return Math.round(amountUsd * rate * 100) / 100;
}
