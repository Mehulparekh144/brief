/** Coupon codes. percent: value is %, fixed and shipping: value is cents. */
export const COUPONS = {
  SAVE10: { type: "percent", value: 10, expires: "2027-12-31" },
  SAVE25: { type: "percent", value: 25, expires: "2027-12-31" },
  SPRING15: { type: "percent", value: 15, expires: "2026-05-31" },
  FIVEOFF: { type: "fixed", value: 500, expires: "2027-12-31" },
  TENOFF: { type: "fixed", value: 1000, expires: "2027-12-31" },
  FREESHIP: { type: "shipping", value: 1500, expires: "2027-12-31" },
};
