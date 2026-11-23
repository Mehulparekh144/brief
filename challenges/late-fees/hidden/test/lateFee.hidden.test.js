import assert from "node:assert/strict";
import { test } from "node:test";
import { isLate, lateFee } from "../src/billing/lateFee.js";
import { parseDate } from "../src/dates/parse.js";

const inv = (amount, paidAt) => ({ id: 1, amount, dueDate: parseDate("2026-03-01"), paidAt: parseDate(paidAt) });

test("hidden: paid in the afternoon of the due date is on time", () => {
  assert.equal(isLate(inv(100, "2026-03-01T15:30:00Z")), false);
});
test("hidden: paid at 23:59:59 on the due date is on time", () => {
  assert.equal(isLate(inv(100, "2026-03-01T23:59:59Z")), false);
});
test("hidden: paid one second after the due day ends is late", () => {
  assert.equal(isLate(inv(100, "2026-03-02T00:00:00Z")), true);
});
test("hidden: unpaid invoice is late only after the due day", () => {
  const unpaid = { id: 2, amount: 100, dueDate: parseDate("2026-03-01"), paidAt: null };
  assert.equal(isLate(unpaid, parseDate("2026-03-01T20:00:00Z")), false);
  assert.equal(isLate(unpaid, parseDate("2026-03-03")), true);
});
test("hidden: fee limits still apply", () => {
  assert.equal(lateFee(inv(20, "2026-03-05")), 2.5);
  assert.equal(lateFee(inv(2000, "2026-03-05")), 50);
  assert.equal(lateFee(inv(20, "2026-03-01T12:00:00Z")), 0);
});
