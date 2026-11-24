import assert from "node:assert/strict";
import { test } from "node:test";
import { match } from "../src/glob.js";

test("star matches a file name", () => {
  assert.equal(match("src/*.js", "src/index.js"), true);
  assert.equal(match("*.json", "package.json"), true);
});

test("a different extension does not match", () => {
  assert.equal(match("*.md", "notes.txt"), false);
});
