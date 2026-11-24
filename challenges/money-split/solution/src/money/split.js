/** Splits integer `cents` between the `ratios` (largest remainder method). The shares always add up to `cents`. */
export function split(cents, ratios) {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new RangeError(`cents must be a whole number, 0 or more: ${cents}`);
  if (!Array.isArray(ratios) || ratios.length === 0 || !ratios.every((r) => typeof r === "number" && Number.isFinite(r) && r > 0)) {
    throw new RangeError("ratios must be a non-empty array of positive numbers");
  }
  const sum = ratios.reduce((a, b) => a + b, 0);
  const parts = ratios.map((r) => cents * r);
  const shares = parts.map((p) => Math.floor(p / sum));
  // Remainders as numerators over `sum`: equal ones stay equal, with no float noise from dividing.
  const order = parts.map((p, i) => [p - shares[i] * sum, i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  let left = cents - shares.reduce((a, b) => a + b, 0);
  for (let k = 0; left > 0; k++, left--) shares[order[k % order.length][1]]++;
  return shares;
}
