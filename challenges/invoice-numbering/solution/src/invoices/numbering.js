const NUMBER = /^INV-(\d{4})-(\d+)$/;

/** The invoice number after `last` (null for the very first invoice). Format: INV-YYYY-NNNN, the counter starts again each UTC year. */
export function nextInvoiceNumber(last, date) {
  const year = date.getUTCFullYear();
  const m = last ? NUMBER.exec(last) : null;
  if (last && !m) throw new Error(`bad invoice number: ${last}`);
  const counter = m && Number(m[1]) === year ? Number(m[2]) + 1 : 1;
  return `INV-${year}-${String(counter).padStart(4, "0")}`;
}
