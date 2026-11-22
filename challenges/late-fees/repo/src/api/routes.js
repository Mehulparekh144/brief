import { createInvoice, markPaid, totalDue } from "../billing/invoice.js";
import { formatMoney } from "../billing/money.js";
import { parseDate } from "../dates/parse.js";
import { validateInvoiceInput } from "./validate.js";

const invoices = new Map();
let nextId = 1;

export function postInvoice(body) {
  const errors = validateInvoiceInput(body);
  if (errors.length) return { status: 400, body: { errors } };
  const invoice = createInvoice({ id: nextId++, customer: body.customer, amount: body.amount, dueDate: parseDate(body.dueDate) });
  invoices.set(invoice.id, invoice);
  return { status: 201, body: invoice };
}

export function postPayment(id, body) {
  const invoice = invoices.get(id);
  if (!invoice) return { status: 404, body: { error: "not found" } };
  const paid = markPaid(invoice, parseDate(body.paidAt));
  invoices.set(id, paid);
  return { status: 200, body: { ...paid, total: formatMoney(totalDue(paid)) } };
}
