# payments

Card helpers for the checkout form.

- `src/card.js` – validateCard(number), used before we send a card to the payment provider
- `src/brand.js` – detect the card brand from its first digits
- `src/mask.js` – mask a card number for receipts

Run the tests with `node --test test/*.test.js`.
