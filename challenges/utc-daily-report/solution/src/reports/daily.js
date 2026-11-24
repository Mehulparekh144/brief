import { utcDate } from "../dates/utc.js";
import { toCents } from "../money/cents.js";

/**
 * Revenue per UTC day, oldest first.
 * Returns [{ date: "YYYY-MM-DD", cents, orders }].
 */
export function dailyRevenue(orders) {
  const byDay = new Map();
  for (const order of orders) {
    const date = utcDate(order.createdAt);
    const row = byDay.get(date) ?? { date, cents: 0, orders: 0 };
    row.cents += toCents(order.amount);
    row.orders += 1;
    byDay.set(date, row);
  }
  return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
}
