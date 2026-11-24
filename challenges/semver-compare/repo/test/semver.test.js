import assert from "node:assert/strict";
import { test } from "node:test";
import { compare } from "../src/semver.js";

test("orders by major, minor and patch", () => {
  assert.equal(compare("1.2.3", "1.2.4"), -1);
  assert.equal(compare("2.0.0", "1.9.9"), 1);
  assert.equal(compare("1.2.3", "1.2.3"), 0);
});

test("parts compare as numbers", () => {
  assert.equal(compare("1.10.0", "1.9.0"), 1);
});
