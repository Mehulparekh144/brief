import assert from "node:assert/strict";
import { test } from "node:test";
import { parseQuery } from "../src/query.js";

test("hidden: repeated keys become arrays, in order", () => {
  assert.deepEqual(parseQuery("a=1&b=2&a=3&a=4"), { a: ["1", "3", "4"], b: "2" });
  assert.deepEqual(parseQuery("tag&tag=x"), { tag: [true, "x"] });
});

test("hidden: + is a space and %2B is a plus", () => {
  assert.deepEqual(parseQuery("q=hello+world&first+name=Ann&n=%2B1"), { q: "hello world", "first name": "Ann", n: "+1" });
});

test("hidden: keys and values are percent-decoded", () => {
  assert.deepEqual(parseQuery("name=J%C3%BCrgen&caf%C3%A9=1&path=%2Fa%2Fb"), { name: "Jürgen", "café": "1", path: "/a/b" });
});

test("hidden: text that fails to decode is kept", () => {
  assert.deepEqual(parseQuery("a=%zz&b=100%&c=%zz+1&%=x"), { a: "%zz", b: "100%", c: "%zz 1", "%": "x" });
});

test("hidden: a key without = is true and a= is empty", () => {
  assert.deepEqual(parseQuery("debug&a=&b"), { debug: true, a: "", b: true });
});

test("hidden: the value keeps later = signs", () => {
  assert.deepEqual(parseQuery("token=abc==&x=a=b"), { token: "abc==", x: "a=b" });
});

test("hidden: empty pieces and empty keys are skipped", () => {
  assert.deepEqual(parseQuery("&a=1&&b=2&"), { a: "1", b: "2" });
  assert.deepEqual(parseQuery("=1&a=2&="), { a: "2" });
  assert.deepEqual(parseQuery(""), {});
  assert.deepEqual(parseQuery("?"), {});
});
