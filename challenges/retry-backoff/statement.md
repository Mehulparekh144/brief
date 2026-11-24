The weather client retries failed requests, but not as designed:
- With `retries: 2` it makes only 2 requests. It should make 3.
- The waits grow by `baseMs` each time (100, 200, 300). They should double (100, 200, 400).
- It waits once more after the last failure, for nothing.
- When it gives up, callers get a generic "gave up" error, so `err.status` is missing.

Rules for retry(fn, { retries, baseMs, maxMs, sleep }) in src/lib/retry.js:
- Call fn at most `retries + 1` times. `retries: 0` means one call.
- Before retry number i (i = 0, 1, 2, ...), wait `baseMs * 2^i` ms, but never more than `maxMs`.
- Do not wait after the last failure.
- Return the result of the first call that succeeds.
- If every call fails, throw the error from the last call. Throw that same object, not a new error.
- Wait only with the `sleep` option, so tests stay fast.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
