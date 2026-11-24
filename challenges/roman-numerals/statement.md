toRoman(n) and fromRoman(s) in src/roman.js work for good input. They accept bad input without an error. Make them strict.

toRoman(n):
1. If n is not an integer (a string, NaN, 3.5, Infinity, null), throw a TypeError. Check this first.
2. If n is an integer below 1 or above 3999, throw a RangeError.
3. Use the standard subtractive forms: 4 = IV, 9 = IX, 40 = XL, 90 = XC, 400 = CD, 900 = CM.

fromRoman(s):
4. If s is not a string, throw a TypeError.
5. Accept only the standard form: the exact string that toRoman returns for a number from 1 to 3999. Uppercase only.
6. Anything else throws a TypeError, not a RangeError. For example "IIII", "VV", "IC", "MMMM", "iv" and "" are invalid.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
