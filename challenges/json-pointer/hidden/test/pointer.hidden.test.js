import assert from "node:assert/strict";
import { test } from "node:test";
import { get } from "../src/pointer.js";

const doc = () => ({
  name: "shop",
  port: 0,
  off: false,
  nil: null,
  "": "empty key",
  "a/b": "slash",
  "m~n": "tilde",
  "~1": "tilde-one",
  "/0": "slash-zero",
  "-": "dash key",
  list: ["x", { name: "y" }, "z"],
});

test("hidden: empty pointer is the whole document, / is the empty key", () => {
  const d = doc();
  assert.equal(get(d, ""), d);
  assert.equal(get(d, "/"), "empty key");
});

test("hidden: ~1 and ~0 are unescaped in the right order", () => {
  const d = doc();
  assert.equal(get(d, "/a~1b"), "slash");
  assert.equal(get(d, "/m~0n"), "tilde");
  assert.equal(get(d, "/~01"), "tilde-one");
  assert.equal(get(d, "/~10"), "slash-zero");
});

test("hidden: array indexes are digits without leading zeros", () => {
  const d = doc();
  assert.equal(get(d, "/list/0"), "x");
  assert.equal(get(d, "/list/1/name"), "y");
  for (const bad of ["01", "1.0", "-1", " 1", "length", "9"]) {
    assert.equal(get(d, `/list/${bad}`), undefined, `/list/${bad}`);
  }
});

test("hidden: - throws on an array and is a normal key on an object", () => {
  assert.throws(() => get(doc(), "/list/-"));
  assert.equal(get(doc(), "/-"), "dash key");
});

test("hidden: missing paths, primitives and inherited keys give undefined", () => {
  const d = doc();
  for (const p of ["/nope", "/nope/deeper", "/name/0", "/name/length", "/port/x", "/off/x", "/nil/x", "/toString", "/__proto__", "/constructor", "/list/1/toString"]) {
    assert.equal(get(d, p), undefined, p);
  }
  assert.equal(get(d, "/nil"), null);
  assert.equal(get(d, "/port"), 0);
  assert.equal(get(d, "/off"), false);
});

test("hidden: bad pointers throw a SyntaxError", () => {
  for (const p of ["a", "name", "#/name", "list/0", "/a~", "/m~2n", "/~/x"]) {
    assert.throws(() => get(doc(), p), SyntaxError, p);
  }
});
