import assert from "node:assert/strict";
import { test } from "node:test";
import { createInvoice } from "../src/invoices/create.js";
import { nextInvoiceNumber } from "../src/invoices/numbering.js";
import { createStore } from "../src/store.js";

test("the first invoice is 0001", () => {
  assert.equal(nextInvoiceNumber(null, new Date("2026-03-01")), "INV-2026-0001");
});

test("numbers go up by one", () => {
  const store = createStore();
  const now = new Date("2026-03-01");
  createInvoice(store, { customer: "Ada", amount: 10 }, now);
  assert.equal(createInvoice(store, { customer: "Bob", amount: 20 }, now).number, "INV-2026-0002");
});
