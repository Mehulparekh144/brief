const BRANDS = [
  ["amex", /^3[47]/],
  ["visa", /^4/],
  ["mastercard", /^(5[1-5]|2[2-7])/],
  ["discover", /^6(011|5)/],
];

/** "4111 1111 1111 1111" -> "visa". */
export function detectBrand(number) {
  const digits = String(number).replace(/\D/g, "");
  for (const [name, re] of BRANDS) if (re.test(digits)) return name;
  return "unknown";
}
