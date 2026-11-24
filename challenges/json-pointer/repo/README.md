# config-tool

Reads values from the JSON config files of our services.

    node -e 'import("./src/config.js").then(m => console.log(m.configGet("config/app.json", "/server/port")))'

- `src/pointer.js` – `get(doc, pointer)`, JSON Pointer lookup (RFC 6901)
- `src/config.js` – `configGet(file, pointer)`, the `config get` command
- `config/app.json` – a sample config

Run the tests with `node --test test/*.test.js`.
