import assert from "node:assert/strict";
import { test } from "node:test";
import { createInvoice, markPaid, totalDue } from "../src/billing/invoice.js";
import { parseDate } from "../src/dates/parse.js";

test("an on-time invoice costs its amount", () => {
  const inv = markPaid(createInvoice({ id: 7, customer: "Ada", amount: 40, dueDate: parseDate("2026-05-10") }), parseDate("2026-05-01"));
  assert.equal(totalDue(inv), 40);
});

test("amount must be positive", () => {
  assert.throws(() => createInvoice({ id: 8, customer: "Ada", amount: 0, dueDate: parseDate("2026-05-10") }));
});
