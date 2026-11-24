# api-gateway

Front door for the API: rate limits per API key, then the handler.

- `src/limits` – token buckets, plans and the per-key registry
- `src/http` – middleware and the request handler
- `src/clock.js` – the system clock (tests pass their own)

Run the tests with `node --test --test-reporter=tap test/*.test.js`.
