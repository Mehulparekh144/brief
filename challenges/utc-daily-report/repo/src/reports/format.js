import { formatCents } from "../money/cents.js";

/** One line per day: "2026-03-02  59.97  (3 orders)". */
export function formatReport(rows) {
  return rows.map((r) => `${r.date}  ${formatCents(r.cents)}  (${r.orders} order${r.orders === 1 ? "" : "s"})`).join("\n");
}
