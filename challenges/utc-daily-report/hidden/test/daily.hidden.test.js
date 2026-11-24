import assert from "node:assert/strict";
import { test } from "node:test";
import { getDailyReport } from "../src/api/routes.js";
import { dailyRevenue } from "../src/reports/daily.js";

const order = (createdAt, amount = "1.00") => ({ id: createdAt, createdAt, amount });
const dates = (rows) => rows.map((r) => r.date);

test("hidden: a positive offset can move an order to the day before", () => {
  assert.deepEqual(dates(dailyRevenue([order("2026-03-02T03:00:00+05:30")])), ["2026-03-01"]);
  assert.deepEqual(dates(dailyRevenue([order("2026-03-02T00:30:00+01:00")])), ["2026-03-01"]);
});
test("hidden: midnight UTC is the start of the day", () => {
  assert.deepEqual(dates(dailyRevenue([order("2026-03-02T00:00:00Z")])), ["2026-03-02"]);
  assert.deepEqual(dates(dailyRevenue([order("2026-03-01T23:59:59Z")])), ["2026-03-01"]);
});
test("hidden: orders with different offsets on one UTC day are merged", () => {
  const rows = dailyRevenue([
    order("2026-03-01T23:30:00-05:00", "1.00"),
    order("2026-03-02T10:00:00Z", "2.00"),
    order("2026-03-02T20:00:00+09:00", "3.00"),
  ]);
  assert.deepEqual(rows, [{ date: "2026-03-02", cents: 600, orders: 3 }]);
});
test("hidden: amounts are summed in exact cents", () => {
  const rows = dailyRevenue([order("2026-03-01T10:00:00Z", "19.99"), order("2026-03-01T11:00:00Z", "19.99"), order("2026-03-01T12:00:00Z", "19.99")]);
  assert.equal(rows[0].cents, 5997);
  assert.equal(dailyRevenue([order("2026-03-01T10:00:00Z", "0.29")])[0].cents, 29);
  assert.equal(dailyRevenue([order("2026-03-01T10:00:00Z", "0.10"), order("2026-03-01T11:00:00Z", "0.20")])[0].cents, 30);
});
test("hidden: days are sorted oldest first", () => {
  const rows = dailyRevenue([
    order("2026-03-05T10:00:00Z"),
    order("2026-03-01T10:00:00Z"),
    order("2026-02-28T22:00:00-05:00"),
    order("2026-03-03T10:00:00Z"),
  ]);
  assert.deepEqual(dates(rows), ["2026-03-01", "2026-03-03", "2026-03-05"]);
  assert.equal(rows[0].orders, 2);
});
test("hidden: the year can roll over", () => {
  assert.deepEqual(dates(dailyRevenue([order("2026-12-31T20:00:00-05:00")])), ["2027-01-01"]);
  assert.deepEqual(dailyRevenue([]), []);
});
test("hidden: the report route uses UTC days and exact cents", () => {
  assert.equal(getDailyReport().body, ["2026-03-01  44.49  (2 orders)", "2026-03-02  44.98  (3 orders)"].join("\n"));
});
