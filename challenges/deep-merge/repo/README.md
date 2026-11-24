# app-config

Loads the app settings: built-in defaults, then the user's settings file on top.

- `src/defaults.js` – the built-in defaults
- `src/merge.js` – merge(target, source)
- `src/config.js` – loadConfig(userSettings)

Run the tests with `node --test test/*.test.js`.
