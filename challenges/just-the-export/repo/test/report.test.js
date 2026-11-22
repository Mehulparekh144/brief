import assert from "node:assert/strict";
import { test } from "node:test";
import { ORDERS } from "../src/data.js";
import { buildReport } from "../src/report.js";

test("one row per order", () => {
  const rows = buildReport(ORDERS);
  assert.equal(rows.length, 3);
  assert.deepEqual(rows[1], { id: 1002, customer: "Grace Hopper", total: "-78.00", status: "refunded" });
});
