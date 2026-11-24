/** Rate limits per plan. */
export const PLANS = {
  free: { capacity: 5, refillPerSec: 1 },
  pro: { capacity: 50, refillPerSec: 10 },
};
