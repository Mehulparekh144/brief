const RATES = { US: 0.07, CA: 0.13, GB: 0.2, DE: 0.19 };

export function taxFor(amount, country) {
  const rate = RATES[country] ?? 0;
  return Math.round(amount * rate * 100) / 100;
}
