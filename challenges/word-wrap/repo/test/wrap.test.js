import assert from "node:assert/strict";
import { test } from "node:test";
import { wrap } from "../src/wrap.js";

test("wraps at spaces", () => {
  assert.equal(wrap("the quick brown fox", 10), "the quick\nbrown fox");
});

test("a line can be exactly width long", () => {
  assert.equal(wrap("abcde fghij", 5), "abcde\nfghij");
});
