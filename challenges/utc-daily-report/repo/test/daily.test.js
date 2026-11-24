import assert from "node:assert/strict";
import { test } from "node:test";
import { dailyRevenue } from "../src/reports/daily.js";

test("a late evening order in New York counts for the next UTC day", () => {
  assert.deepEqual(dailyRevenue([{ id: 1, createdAt: "2026-03-01T23:30:00-05:00", amount: "10.00" }]), [
    { date: "2026-03-02", cents: 1000, orders: 1 },
  ]);
});

test("orders on the same day are added up", () => {
  const rows = dailyRevenue([
    { id: 1, createdAt: "2026-03-01T09:00:00Z", amount: "10.00" },
    { id: 2, createdAt: "2026-03-01T15:00:00Z", amount: "5.50" },
  ]);
  assert.deepEqual(rows, [{ date: "2026-03-01", cents: 1550, orders: 2 }]);
});
