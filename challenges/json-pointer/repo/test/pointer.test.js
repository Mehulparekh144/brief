import assert from "node:assert/strict";
import { test } from "node:test";
import { get } from "../src/pointer.js";

const doc = { server: { port: 8080 }, servers: [{ host: "a" }, { host: "b" }] };

test("reads a nested key", () => {
  assert.equal(get(doc, "/server/port"), 8080);
});

test("reads an array item", () => {
  assert.equal(get(doc, "/servers/1/host"), "b");
});
