Our API rate limit lets clients through far too often:
- After a client uses up its tokens, it gets new ones almost at once.
- After a quiet hour, a client can send thousands of requests in one burst.

Each API key has a token bucket (src/limits/bucket.js). Rules:
- `now()` returns the time in milliseconds.
- `refillPerSec` is tokens per second. With `refillPerSec: 1`, one token comes back after 1000 ms.
- A bucket starts full. It never holds more than `capacity` tokens, however long it is idle.
- allow() takes one token and returns true only when at least one whole token is there. Otherwise it returns false and takes nothing.
- Part tokens add up: four waits of 250 ms at `refillPerSec: 1` give one token.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
