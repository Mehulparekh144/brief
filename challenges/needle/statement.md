Checkout crashes for some discount codes. Support sent this error:

    TypeError: Cannot read properties of undefined (reading 'minSubtotal')
        at applyDiscount (src/pricing/discounts.js:12:20)
        at checkout (src/orders/checkout.js:15:20)

Rules:
- Discount codes are case-insensitive: "SAVE10" works like "save10".
- Spaces around a code are ignored.
- An unknown code gives no discount. It must not crash.

The agent does not see this page. Only your messages.

Done when: all tests pass, hidden ones too.
Check: node --test test/*.test.js
