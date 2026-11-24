Security report: the static file server serves files outside its folder. The root is /srv/app/public. These requests got through:
- GET /static/../public-backup/db.sqlite
- GET /static//srv/app/public-backup/db.sqlite

There is a second, smaller bug. Files with a space in the name give 404: GET /static/my%20notes.txt.

Rules for safeJoin(root, userPath) in src/lib/safePath.js:
- Percent-decode userPath once, then check it. "my%20notes.txt" means "my notes.txt".
- Throw an Error if the decoded path is absolute.
- Throw an Error if any segment of the decoded path is "..". Encoded forms count: "%2e%2e" and ".%2E" decode to "..".
- "docs/../a.txt" also throws, even though it stays inside root.
- A name that only contains dots is fine when it is not exactly "..": "a..b.txt" and "..hidden" are allowed.
- Nested folders are fine: "docs/guides/intro.md" gives "/srv/app/public/docs/guides/intro.md".
- The result must be inside root. "/srv/app/public-backup" is not inside "/srv/app/public".
- Return the absolute, decoded path.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
