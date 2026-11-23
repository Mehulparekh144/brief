import assert from "node:assert/strict";
import { test } from "node:test";
import { isLate, lateFee } from "../src/billing/lateFee.js";
import { parseDate } from "../src/dates/parse.js";

const invoice = (paidAt) => ({ id: 1, amount: 100, dueDate: parseDate("2026-03-01"), paidAt: parseDate(paidAt) });

test("payment after the due date is late", () => {
  assert.equal(isLate(invoice("2026-03-02")), true);
  assert.equal(lateFee(invoice("2026-03-02")), 5);
});

test("payment before the due date is not late", () => {
  assert.equal(isLate(invoice("2026-02-27")), false);
});

test("payment on the due date is not late", () => {
  assert.equal(isLate(invoice("2026-03-01")), false);
  assert.equal(lateFee(invoice("2026-03-01")), 0);
});
