Support gets tickets about orders with more than one coupon:
- Two customers used the same coupons and paid different totals. Only the order they typed the codes in was different.
- SAVE10 and SAVE25 together gave 32.5% off. Percent coupons must not stack.
- One order had a negative total.
- FREESHIP on an order that already had free shipping took money off the items.

Rules for applyCoupons({ items, shipping }, coupons) in src/coupons/apply.js. All amounts are in cents.
- A coupon has a `type`: "percent", "fixed" or "shipping", and a `value`.
- Only one percent coupon counts: the one with the highest value. Ignore the other percent coupons.
- The percent coupon applies first, to `items`. Round the discount to the nearest cent with Math.round.
- Then subtract every fixed coupon from `items`.
- `items` never goes below 0. Extra fixed discount is lost. It does not reduce shipping.
- Shipping coupons reduce only `shipping`, and never below 0.
- `total` is `items + shipping`. The order of the coupons in the list does not change the result.
- The result stays `{ items, shipping, total }`.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
