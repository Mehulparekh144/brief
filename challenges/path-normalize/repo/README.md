# static-server

Serves the files under /srv/app/public at /static/.

- `src/server` – router, static handler and MIME types
- `src/lib` – path and response helpers
- `src/config.js` – the static root

Run the tests with `node --test --test-reporter=tap test/*.test.js`.
