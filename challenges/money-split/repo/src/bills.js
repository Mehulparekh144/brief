import { formatCents } from "./money/format.js";
import { split } from "./money/split.js";

/** bill = { total: cents, people: [{ name, weight }] }. Returns one "name: $x.yy" line per person. */
export function splitBill(bill) {
  const shares = split(bill.total, bill.people.map((p) => p.weight));
  return bill.people.map((p, i) => `${p.name}: ${formatCents(shares[i])}`);
}
