const VALUES = [
  ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
  ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
  ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1],
];

/** 1994 -> "MCMXCIV" */
export function toRoman(n) {
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
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = DIGITS[s[i]];
    const next = DIGITS[s[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  return total;
}
