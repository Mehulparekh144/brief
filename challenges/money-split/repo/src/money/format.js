/** 1234 → "$12.34" */
export const formatCents = (cents) => `$${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
