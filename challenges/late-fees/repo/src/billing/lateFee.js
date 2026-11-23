import { roundCents } from "./money.js";

const FEE_RATE = 0.05; // 5% of the invoice amount
const MIN_FEE = 2.5;
const MAX_FEE = 50;

/** True when the invoice was paid (or is still unpaid) after its due date. */
export function isLate(invoice, now = new Date()) {
  const paid = invoice.paidAt ?? now;
  return paid >= invoice.dueDate;
}

export function lateFee(invoice, now = new Date()) {
  if (!isLate(invoice, now)) return 0;
  const fee = roundCents(invoice.amount * FEE_RATE);
  return Math.min(MAX_FEE, Math.max(MIN_FEE, fee));
}
