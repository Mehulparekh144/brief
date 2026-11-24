Checkout accepts any card number that has the right length. Make validateCard(number) in src/card.js check it properly.

1. If number is not a string, return false. Never throw.
2. The space character and "-" may appear anywhere. Ignore them.
3. Any other character makes the number invalid, also a tab or a newline.
4. After you remove spaces and dashes, there must be 13 to 19 digits.
5. The digits must pass the Luhn check: start at the rightmost digit and double every second digit. If a doubled digit is more than 9, subtract 9. The sum of all digits must be a multiple of 10.

Return true or false.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
