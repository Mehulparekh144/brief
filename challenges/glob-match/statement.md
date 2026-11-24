The file watcher rebuilds only the changed files that match a pattern from `src/config.js`. `match(pattern, path)` in `src/glob.js` is a quick regex hack and gets many paths wrong. Rewrite it with these rules. Paths and patterns use `/` between segments.

1. The whole path must match, not only a part. `*.js` does not match `a.jsx`.
2. `*` matches any run of characters inside one segment, also none. It never matches `/`.
3. `?` matches exactly one character. It never matches `/`.
4. `**` as a whole segment matches zero or more segments. `a/**/b` matches `a/b` and `a/x/y/b`.
5. `a/**` also matches `a`.
6. `**` inside a segment, like `**.js`, acts as `*`.
7. A backslash makes the next character literal: `\*` matches `*`, `\?` matches `?`, `\\` matches `\`.
8. Every other character is literal. `.`, `+`, `(` and `[` are not special.

Keep the signature: `match(pattern, path)` returns a boolean. Do not add packages.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
