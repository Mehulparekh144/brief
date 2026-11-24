import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULTS } from "../src/config/defaults.js";
import { loadConfig } from "../src/config/load.js";

test("--port beats APP_PORT", () => {
  assert.equal(loadConfig(DEFAULTS, {}, { APP_PORT: "9000" }, { port: 7000 }).port, 7000);
});

test("file values beat defaults", () => {
  assert.equal(loadConfig(DEFAULTS, { host: "127.0.0.1" }, {}, {}).host, "127.0.0.1");
});
