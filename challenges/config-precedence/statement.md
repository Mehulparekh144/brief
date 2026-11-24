Two reports from the ops team:
- `worker --port 7000` still listens on 9000 when APP_PORT=9000 is set.
- APP_DEBUG=false turns debug mode on.

Rules for loadConfig(defaults, file, env, cli) in src/config/load.js:
- Precedence, highest first: cli, then env, then file, then defaults.
- An env variable is APP_ plus the key in upper case. port is APP_PORT. log_level is APP_LOG_LEVEL.
- Env values are strings. Convert each one to the type of the default for that key:
  - number default: "9000" becomes 9000.
  - boolean default: "true" becomes true, "false" becomes false.
  - string default: keep the string.
- Ignore env variables for keys that are not in defaults (APP_SECRET_TOKEN). Ignore variables without the APP_ prefix (PATH, HOME).
- Use file and cli values as they are.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
