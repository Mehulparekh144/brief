import assert from "node:assert/strict";
import { test } from "node:test";
import { LRUCache } from "../src/lru.js";

test("hidden: get() makes a key the most recently used", () => {
  const c = new LRUCache(2);
  c.set("a", 1);
  c.set("b", 2);
  assert.equal(c.get("a"), 1);
  c.set("c", 3);
  assert.equal(c.has("a"), true);
  assert.equal(c.has("b"), false);
  assert.equal(c.has("c"), true);
});

test("hidden: set() on an existing key updates the value and the order, and evicts nothing", () => {
  const c = new LRUCache(3);
  c.set("a", 1);
  c.set("b", 2);
  c.set("c", 3);
  c.set("c", 30);
  assert.equal(c.has("a"), true);
  c.set("a", 10);
  c.set("d", 4);
  assert.equal(c.has("b"), false);
  assert.deepEqual([c.get("a"), c.get("c"), c.get("d")], [10, 30, 4]);
});

test("hidden: has() does not change the order of use", () => {
  const c = new LRUCache(2);
  c.set("a", 1);
  c.set("b", 2);
  assert.equal(c.has("a"), true);
  c.set("c", 3);
  assert.equal(c.has("a"), false);
  assert.equal(c.has("b"), true);
});

test("hidden: size counts the keys", () => {
  const c = new LRUCache(2);
  assert.equal(c.size, 0);
  c.set("a", 1);
  assert.equal(c.size, 1);
  c.set("a", 2);
  assert.equal(c.size, 1);
  c.set("b", 2);
  c.set("c", 3);
  c.get("missing");
  assert.equal(c.size, 2);
});

test("hidden: set() returns the cache", () => {
  const c = new LRUCache(2);
  assert.equal(c.set("a", 1), c);
  c.set("b", 2).set("c", 3);
  assert.equal(c.has("a"), false);
  assert.equal(c.get("c"), 3);
});

test("hidden: capacity must be an integer of at least 1", () => {
  for (const cap of [0, -1, 1.5, NaN, "3", undefined]) assert.throws(() => new LRUCache(cap), RangeError, String(cap));
  const c = new LRUCache(1);
  c.set("a", 1);
  c.set("b", 2);
  assert.equal(c.has("a"), false);
  assert.equal(c.get("b"), 2);
});
