export function validateInvoiceInput(body) {
  const errors = [];
  if (typeof body.customer !== "string" || !body.customer) errors.push("customer is required");
  if (typeof body.amount !== "number" || body.amount <= 0) errors.push("amount must be a positive number");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate ?? "")) errors.push("dueDate must be YYYY-MM-DD");
  return errors;
}
