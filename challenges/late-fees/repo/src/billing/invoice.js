import { lateFee } from "./lateFee.js";
import { roundCents } from "./money.js";

export function createInvoice({ id, customer, amount, dueDate }) {
  if (!(amount > 0)) throw new Error("amount must be positive");
  return { id, customer, amount: roundCents(amount), dueDate, paidAt: null };
}

export function markPaid(invoice, paidAt) {
  if (invoice.paidAt) throw new Error(`invoice ${invoice.id} is already paid`);
  return { ...invoice, paidAt };
}

/** Amount plus any late fee. */
export function totalDue(invoice) {
  return roundCents(invoice.amount + lateFee(invoice));
}
