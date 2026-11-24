parseCookies(header) in src/cookies.js reads the Cookie request header into an object of name to value. It crashes or gives wrong values for real headers. Make it follow these rules:

1. If header is not a string, return {}.
2. Split the header on ";".
3. Skip a pair without "=" (like "secure" or an empty pair).
4. The name is the text before the first "=". The value is everything after it: "t=abc==" gives { t: "abc==" }.
5. Trim spaces around the name and the value. Skip a pair with an empty name ("=x"). An empty value is fine: "a=" gives { a: "" }.
6. Names are case-sensitive. Do not decode names. Names like "toString" or "constructor" are normal names.
7. If a name appears more than once, the first one wins.
8. If the value is at least 2 characters long and starts and ends with a double quote, remove those two quotes.
9. Then percent-decode the value. If decoding fails, keep the value from step 8. "+" stays "+" (it is not a space). Quotes that come from decoding stay.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
