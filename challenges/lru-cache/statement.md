LRUCache in src/lru.js is a fixed-size cache. Today it evicts by insertion order, not by use. Make it a real least-recently-used cache:

1. new LRUCache(capacity): capacity must be an integer of at least 1. Otherwise (0, -1, 1.5, "3") throw a RangeError.
2. get(key) returns the value, or undefined when the key is missing. A hit makes the key the most recently used.
3. set(key, value) adds a key or updates the value of an existing key. Both make the key the most recently used.
4. Updating an existing key never evicts anything.
5. When a new key is added and the cache is full, first remove the least recently used key.
6. set() returns the cache, so calls can chain: cache.set("a", 1).set("b", 2).
7. has(key) returns true or false. It does not change the order of use.
8. The size getter returns the number of keys in the cache.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
