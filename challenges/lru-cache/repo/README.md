# user-service

Looks up user profiles. Recent profiles are kept in a small in-memory cache.

- `src/lru.js` – LRUCache
- `src/db.js` – the profile store (a stub for now)
- `src/users.js` – getUser(id), with the cache in front of the store

Run the tests with `node --test test/*.test.js`.
