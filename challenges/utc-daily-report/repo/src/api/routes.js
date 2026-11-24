import { ORDERS } from "../data/orders.js";
import { dailyRevenue } from "../reports/daily.js";
import { formatReport } from "../reports/format.js";

/** GET /reports/daily. Plain text, or JSON with ?format=json. */
export function getDailyReport(query = {}, orders = ORDERS) {
  const rows = dailyRevenue(orders);
  if (query.format === "json") return { type: "application/json", body: JSON.stringify(rows) };
  return { type: "text/plain", body: formatReport(rows) };
}
