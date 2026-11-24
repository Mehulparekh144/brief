merge(target, source) in src/merge.js combines the default settings with the user's settings. Today it changes the defaults in place and joins arrays. Make it follow these rules:

1. Return a new object. Do not change target or source, at any depth.
2. A plain object (made with {} or JSON.parse) in source merges into the plain object at the same key in target, recursively. If the target value is not a plain object, merge into an empty object.
3. An array in source replaces the target value. Do not join arrays.
4. A source key whose value is undefined is skipped, at every depth. It does not remove the target value, and it is not added to the result.
5. null in source overwrites the target value.
6. Plain objects and arrays in the result are always new copies, at every depth. This includes the parts that come from target. A change to the result must never change target or source.
7. Other objects (Date, Map, class instances) are kept by reference. Do not clone them or merge into them.
8. Any other source value replaces the target value.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
