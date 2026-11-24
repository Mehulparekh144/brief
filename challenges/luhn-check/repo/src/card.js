/** True when number is a card number we can send to the payment provider. */
export function validateCard(number) {
  // TODO: real checks. For now we only look at the length.
  return number.length >= 13 && number.length <= 19;
}
