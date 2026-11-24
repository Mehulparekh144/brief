# worker

Background worker with an HTTP health port.

Config comes from four places: built-in defaults, config.json, APP_* env variables and command-line flags.

- `src/config` – defaults, file reading, env names and the loader
- `src/cli` – command-line flags
- `src/server` – starts the listener

Run the tests with `node --test --test-reporter=tap test/*.test.js`.
