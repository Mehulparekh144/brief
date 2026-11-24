# watcher

Rebuilds the files that changed since the last build.

- `src/config.js` – the patterns to watch
- `src/glob.js` – `match(pattern, path)`, glob matching on `/` paths
- `src/watch.js` – picks the changed paths that match a pattern

Run the tests with `node --test test/*.test.js`.
