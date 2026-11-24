/** "19.99" -> 1999. Math.round removes float error: 19.99 * 100 is 1998.9999999999998. */
export const toCents = (amount) => Math.round(Number(amount) * 100);

/** 1999 -> "19.99" */
export const formatCents = (cents) => (cents / 100).toFixed(2);
