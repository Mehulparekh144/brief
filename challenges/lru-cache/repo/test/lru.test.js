import assert from "node:assert/strict";
import { test } from "node:test";
import { LRUCache } from "../src/lru.js";

test("stores and returns values", () => {
  const c = new LRUCache(2);
  c.set("a", 1);
  c.set("b", 2);
  assert.equal(c.get("a"), 1);
  assert.equal(c.get("b"), 2);
  assert.equal(c.get("x"), undefined);
});

test("drops the oldest key when full", () => {
  const c = new LRUCache(2);
  c.set("a", 1);
  c.set("b", 2);
  c.set("c", 3);
  assert.equal(c.has("a"), false);
  assert.equal(c.has("c"), true);
});
