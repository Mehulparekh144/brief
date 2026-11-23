import { orderHistory } from "../orders/history.js";

export function dailyReport(day = new Date()) {
  const key = day.toISOString().slice(0, 10);
  const today = orderHistory().filter((o) => o.at.toISOString().slice(0, 10) === key);
  const revenue = today.reduce((s, o) => s + o.total, 0);
  return { day: key, orders: today.length, revenue: Math.round(revenue * 100) / 100 };
}
