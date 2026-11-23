Make three changes to the cart library:

1. Rename calcTotal to calculateTotal everywhere: code, tests and README.
2. Change the default currency from USD to EUR.
3. Add a `discount` option to calculateTotal. It is a fraction from 0 to 1 (default 0), applied to the subtotal before tax. A value outside 0–1 throws an error.

Done when: all tests pass, hidden ones too.
Check: node --test test/*.test.js
