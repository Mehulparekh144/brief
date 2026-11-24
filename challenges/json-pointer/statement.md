`get(doc, pointer)` in `src/pointer.js` reads a value from a JSON document with a JSON Pointer (RFC 6901). `config get /server/port` uses it. Today it only splits on `/`. Make it follow these rules:

1. `""` (the empty pointer) returns the whole document.
2. Any other pointer must start with `/`. If not, throw a `SyntaxError`.
3. A `~` that is not followed by `0` or `1` is a `SyntaxError`.
4. Split on `/`. In each part, replace `~1` with `/` first, then `~0` with `~`. So `/~01` reads the key `~1`.
5. On an array, a part must be digits with no leading zero (`0`, `7`, `12`). Other parts (`01`, `-1`, `1.5`, `length`) give `undefined`.
6. On an array, the part `-` throws an `Error`. On an object, `-` is a normal key.
7. Only own properties count: `/toString` on `{}` gives `undefined`.
8. Strings, numbers, booleans and `null` have no children. `/name/0` gives `undefined`, also when `name` is a string.
9. A path that does not exist gives `undefined`. A value that is `null` stays `null`.

Keep the signature. Do not change `src/config.js`.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
