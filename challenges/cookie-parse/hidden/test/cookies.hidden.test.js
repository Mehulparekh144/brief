import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCookies } from "../src/cookies.js";

// Copy into a plain object, so a result made with Object.create(null) also compares.
const parse = (h) => ({ ...parseCookies(h) });

test("hidden: spaces around names and values are trimmed", () => {
  assert.deepEqual(parse("  a = 1 ;b=2  ;   c =3"), { a: "1", b: "2", c: "3" });
});

test("hidden: pairs without = or without a name are skipped", () => {
  assert.deepEqual(parse("secure; a=1; ; HttpOnly; =oops;  = x; b="), { a: "1", b: "" });
});

test("hidden: the value keeps later = signs", () => {
  assert.deepEqual(parse("token=abc==; x=a=b"), { token: "abc==", x: "a=b" });
});

test("hidden: the first occurrence wins and names are case-sensitive", () => {
  assert.deepEqual(parse("a=1; b=2; a=3; A=4"), { a: "1", b: "2", A: "4" });
});

test("hidden: names are not decoded and names like toString work", () => {
  assert.deepEqual(parse("my%20name=1; toString=2; constructor=3; hasOwnProperty=4; toString=5"), {
    "my%20name": "1",
    toString: "2",
    constructor: "3",
    hasOwnProperty: "4",
  });
});

test("hidden: a value that fails to decode is kept, and + stays +", () => {
  assert.deepEqual(parse("a=%zz; b=100%; c=%E0%A4%A; d=a+b; e=%2B"), { a: "%zz", b: "100%", c: "%E0%A4%A", d: "a+b", e: "+" });
});

test("hidden: surrounding double quotes are removed before decoding", () => {
  assert.deepEqual(parse('a="hello world"; b=" x "; c="unclosed; d=""; e="; f=%22q%22; g="%22"; h="%zz"'), {
    a: "hello world",
    b: " x ",
    c: '"unclosed',
    d: "",
    e: '"',
    f: '"q"',
    g: '"',
    h: "%zz",
  });
});

test("hidden: a missing header gives {}", () => {
  for (const h of [undefined, null, 42, ""]) assert.deepEqual(parse(h), {}, String(h));
});
