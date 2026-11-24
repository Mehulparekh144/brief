import assert from "node:assert/strict";
import { test } from "node:test";
import { nextInvoiceNumber } from "../src/invoices/numbering.js";

const d = (iso) => new Date(iso);

test("hidden: the very first invoice is 0001", () => {
  assert.equal(nextInvoiceNumber(null, d("2026-03-01")), "INV-2026-0001");
  assert.equal(nextInvoiceNumber(null, d("2031-12-31")), "INV-2031-0001");
});

test("hidden: the counter goes up by one and keeps 4 digits", () => {
  assert.equal(nextInvoiceNumber("INV-2026-0041", d("2026-05-05")), "INV-2026-0042");
  assert.equal(nextInvoiceNumber("INV-2026-0999", d("2026-05-05")), "INV-2026-1000");
});

test("hidden: the counter starts again in a new year", () => {
  assert.equal(nextInvoiceNumber("INV-2025-0042", d("2026-01-01")), "INV-2026-0001");
  assert.equal(nextInvoiceNumber("INV-2025-9999", d("2026-01-02")), "INV-2026-0001");
  assert.equal(nextInvoiceNumber("INV-2024-0007", d("2026-06-01")), "INV-2026-0001");
});

test("hidden: the counter keeps growing after 9999", () => {
  assert.equal(nextInvoiceNumber("INV-2026-9999", d("2026-11-01")), "INV-2026-10000");
  assert.equal(nextInvoiceNumber("INV-2026-10000", d("2026-11-01")), "INV-2026-10001");
  assert.equal(nextInvoiceNumber("INV-2026-12345", d("2026-11-01")), "INV-2026-12346");
});

test("hidden: the year is the UTC year", () => {
  assert.equal(nextInvoiceNumber("INV-2026-0007", d("2026-12-31T23:59:59Z")), "INV-2026-0008");
  assert.equal(nextInvoiceNumber("INV-2026-0008", d("2027-01-01T00:00:00Z")), "INV-2027-0001");
});
