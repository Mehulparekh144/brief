A bad config.json should list every problem at once. Make `validate(config)` in appconfig/validate.py return all errors as a list of strings. The ops team searches logs for these exact texts.

| Key | Rule | Message |
|---|---|---|
| host | required; a string that is not empty (spaces only count as empty) | `host: must be a non-empty string` |
| port | required; an integer from 1 to 65535 | `port: must be an integer between 1 and 65535` |
| debug | optional; true or false | `debug: must be true or false` |
| workers | optional; an integer from 1 to 64 | `workers: must be an integer between 1 and 64` |
| log_level | optional; debug, info, warning or error (lowercase) | `log_level: must be one of debug, info, warning, error` |

- A missing required key gives `<key>: is required`.
- A key that is not in the table gives `<key>: unknown setting`.
- A bool is not an integer: `"port": true` is an error.
- At most one message per key.
- Sort the messages by key.
- A valid config gives `[]`.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
