/**
 * Revenue per day.
 * Returns [{ date: "YYYY-MM-DD", cents, orders }].
 */
export function dailyRevenue(orders) {
  const byDay = new Map();
  for (const order of orders) {
    const date = order.createdAt.slice(0, 10);
    const row = byDay.get(date) ?? { date, cents: 0, orders: 0 };
    row.cents += Math.trunc(parseFloat(order.amount) * 100);
    row.orders += 1;
    byDay.set(date, row);
  }
  return [...byDay.values()];
}
