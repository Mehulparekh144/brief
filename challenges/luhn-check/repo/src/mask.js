/** "4111111111111111" -> "**** **** **** 1111". */
export function maskCard(number) {
  const digits = String(number).replace(/\D/g, "");
  return `**** **** **** ${digits.slice(-4)}`;
}
