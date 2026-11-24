`slugify(title)` in `src/slugify.js` turns post titles into URL slugs. It works, but it has only one smoke test. Write real tests.

- Put them in `test/slugify.test.js`. Use `node:test` and `node:assert/strict`. No other packages.
- Import it with `import { slugify } from "../src/slugify.js";`
- Cover each rule:
  - The result is lower case.
  - Accented letters become plain letters: `"Crème Brûlée"` → `"creme-brulee"`.
  - A run of other characters becomes one hyphen: `"a  &  b"` → `"a-b"`.
  - No hyphen at the start or the end: `"  ¡Hola!  "` → `"hola"`.
  - At most 40 characters: a word of 50 letters gives its first 40.
  - When the cut at 40 ends on a hyphen, the hyphen goes too.
- Do not change `src/slugify.js` or `test/smoke.test.js`.

A hidden check runs your file against 6 broken versions of `slugify()`. Your tests must fail on each of them.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
