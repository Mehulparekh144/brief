const VALUES = [
  ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
  ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
  ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1],
];

/** 1994 -> "MCMXCIV" */
export function toRoman(n) {
  if (!Number.isInteger(n)) throw new TypeError(`not an integer: ${n}`);
  if (n < 1 || n > 3999) throw new RangeError(`out of range: ${n}`);
  let out = "";
  for (const [sym, val] of VALUES) {
    while (n >= val) {
      out += sym;
      n -= val;
    }
  }
  return out;
}

const DIGITS = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

/** "MCMXCIV" -> 1994 */
export function fromRoman(s) {
  if (typeof s !== "string") throw new TypeError("not a string");
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = DIGITS[s[i]];
    if (!cur) throw new TypeError(`not a Roman numeral: ${s}`);
    const next = DIGITS[s[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  // Only the standard form is valid: it must round-trip exactly.
  if (total < 1 || total > 3999 || toRoman(total) !== s) throw new TypeError(`not a Roman numeral: ${s}`);
  return total;
}
