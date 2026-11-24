/** Splits `cents` between the `ratios`. Returns one amount per ratio. */
export function split(cents, ratios) {
  const sum = ratios.reduce((a, b) => a + b, 0);
  return ratios.map((r) => Math.round((cents * r) / sum));
}
