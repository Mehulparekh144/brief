import { nextInvoiceNumber } from "./numbering.js";

/** Creates and saves an invoice with the next free number. */
export function createInvoice(store, { customer, amount }, now = new Date()) {
  const number = nextInvoiceNumber(store.lastNumber(), now);
  return store.save({ number, customer, amount, issuedAt: now.toISOString() });
}
