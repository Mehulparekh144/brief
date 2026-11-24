parseQuery(str) in src/query.js turns a URL query string into an object. It only handles simple input like "a=1&b=2". Make it follow these rules:

1. A leading "?" is optional: "?a=1" and "a=1" give the same result.
2. Split on "&". Skip empty pieces: "a=1&&b=2&" has two pairs.
3. The key is the text before the first "=". The value is everything after it: "x=a=b" gives { x: "a=b" }.
4. Skip a piece with an empty key ("=1").
5. A piece without "=" gets the value true: "debug" gives { debug: true }. "a=" gives { a: "" }.
6. "+" is a space, in keys and in values. Replace it before decoding, so "%2B" gives "+".
7. Then percent-decode keys and values. If decoding fails ("%zz", "100%"), keep the text from step 6.
8. A key that appears more than once gets an array of all its values, in order: "a=1&a=2" gives { a: ["1", "2"] }, and "tag&tag=x" gives { tag: [true, "x"] }. A key that appears once keeps a plain value.
9. "" and "?" give {}.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
