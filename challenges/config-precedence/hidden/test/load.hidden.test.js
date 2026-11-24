import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULTS } from "../src/config/defaults.js";
import { loadConfig } from "../src/config/load.js";
import { resolveConfig, startServer } from "../src/index.js";

test("hidden: env beats the file, as a number", () => {
  assert.equal(loadConfig(DEFAULTS, { port: 8000 }, { APP_PORT: "9000" }, {}).port, 9000);
});
test("hidden: number defaults turn env strings into numbers", () => {
  const c = loadConfig(DEFAULTS, {}, { APP_WORKERS: "4", APP_PORT: "3000" }, {});
  assert.equal(c.workers, 4);
  assert.equal(c.port, 3000);
});
test("hidden: boolean defaults accept true and false", () => {
  assert.equal(loadConfig(DEFAULTS, {}, { APP_DEBUG: "false" }, {}).debug, false);
  assert.equal(loadConfig(DEFAULTS, { debug: true }, { APP_DEBUG: "false" }, {}).debug, false);
  assert.equal(loadConfig(DEFAULTS, {}, { APP_DEBUG: "true" }, {}).debug, true);
});
test("hidden: string defaults keep the string", () => {
  const c = loadConfig(DEFAULTS, {}, { APP_LOG_LEVEL: "debug", APP_HOST: "10.0.0.5" }, {});
  assert.equal(c.log_level, "debug");
  assert.equal(c.host, "10.0.0.5");
});
test("hidden: unknown and unprefixed env variables are ignored", () => {
  const c = loadConfig(DEFAULTS, {}, { APP_SECRET_TOKEN: "s3cr3t", PATH: "/usr/bin", HOME: "/root", PORT: "1" }, {});
  assert.deepEqual(c, DEFAULTS);
});
test("hidden: all four layers in order", () => {
  const c = loadConfig(
    DEFAULTS,
    { host: "127.0.0.1", workers: 3, log_level: "warn" },
    { APP_WORKERS: "6", APP_DEBUG: "true", APP_LOG_LEVEL: "error" },
    { debug: false, log_level: "debug" },
  );
  assert.deepEqual(c, { port: 8080, host: "127.0.0.1", workers: 6, debug: false, log_level: "debug" });
});
test("hidden: the worker uses --port over APP_PORT end to end", () => {
  const readFile = () => '{ "port": 8000, "workers": 3 }';
  const config = resolveConfig({ argv: ["--port", "7000"], env: { APP_PORT: "9000", APP_DEBUG: "false" }, readFile });
  let listened;
  const line = startServer(config, (port, host) => {
    listened = [port, host];
  });
  assert.deepEqual(listened, [7000, "0.0.0.0"]);
  assert.equal(line, "listening on 0.0.0.0:7000 with 3 workers");
});
