`split(cents, ratios)` in `src/money/split.js` splits a bill between people by ratio. It rounds each share, so the shares can add up to a cent more or less than the bill. Rewrite it with these rules:

1. Return one whole number of cents per ratio, in the same order as `ratios`.
2. `cents` must be a whole number, 0 or more. If not, throw an `Error`.
3. `ratios` must be a non-empty array of positive, finite numbers. 0, negative numbers, `NaN`, `Infinity` and strings are not allowed. If not, throw an `Error`.
4. First give each share `Math.floor(cents × ratio / sum of ratios)`.
5. Then give the cents that are left, one at a time, to the shares with the largest fractional part.
6. When two fractional parts are equal, the earlier index gets the cent first.
7. The shares always add up to `cents`.

Example: `split(100, [1, 1, 1])` → `[34, 33, 33]`.

Keep the signature. Do not change other files.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
