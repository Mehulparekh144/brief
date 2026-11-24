# weather-client

HTTP client for the weather service, with retries.

- `src/http` – client and errors
- `src/lib` – retry and sleep helpers
- `src/services` – weather calls
- `src/config.js` – default retry settings

Run the tests with `node --test --test-reporter=tap test/*.test.js`.
