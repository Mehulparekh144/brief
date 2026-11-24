/** new-checkout -> FLAG_NEW_CHECKOUT */
export const envName = (flag) => `FLAG_${flag.toUpperCase().replace(/-/g, "_")}`;
