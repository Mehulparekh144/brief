`src/cart.js` holds the shopping cart logic: `addItem`, `removeItem`, `applyCoupon` and `total`. It has one smoke test. Write the real tests in our team's format.

Format:
- File: `test/cart.test.js`. Use `node:test` (`describe`, `test`) and `node:assert/strict`. No other packages.
- One `describe()` block per function. Name it after the function, with `()`: `describe("addItem()", ...)`, `describe("removeItem()", ...)`, `describe("applyCoupon()", ...)`, `describe("total()", ...)`.
- Put the tests of each function inside its block.

Cover:
- `addItem()`: the same sku twice adds up the qty. A qty of 0 throws a `RangeError`.
- `removeItem()`: it removes only that sku and keeps the others.
- `applyCoupon()`: the code ignores case and spaces (`"  save10 "` works). An unknown code throws.
- `total()`: `SAVE10` rounds the discount to the nearest cent (1005 cents → 904). `FIVEOFF` never takes the total below 0.

Do not change `src/cart.js` or `test/smoke.test.js`.

A hidden check reads your describe names and runs your file against 6 broken versions of the cart. Your tests must fail on each of them.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
