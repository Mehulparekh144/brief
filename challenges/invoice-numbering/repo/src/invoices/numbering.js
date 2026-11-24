/** The invoice number after `last` (null for the very first invoice). Format: INV-YYYY-NNNN. */
export function nextInvoiceNumber(last, date) {
  const year = date.getUTCFullYear();
  if (!last) return `INV-${year}-0001`;
  const counter = Number(last.slice(-4)) + 1;
  return `INV-${year}-${String(counter).padStart(4, "0").slice(-4)}`;
}
