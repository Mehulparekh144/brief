import assert from "node:assert/strict";
import { test } from "node:test";
import { match } from "../src/glob.js";

const yes = (pattern, path) => assert.equal(match(pattern, path), true, `${pattern} should match ${path}`);
const no = (pattern, path) => assert.equal(match(pattern, path), false, `${pattern} should not match ${path}`);

test("hidden: the whole path must match", () => {
  no("*.js", "a.jsx");
  no("b.js", "ab.js");
  no("src", "src/a.js");
  no("src/*.js", "lib/src/a.js");
  yes("src/*.js", "src/a.js");
});

test("hidden: * stays inside one segment", () => {
  no("src/*.js", "src/a/b.js");
  no("*", "a/b");
  yes("a*b", "ab");
  yes("*.test.js", "x.test.js");
  yes("src/*/index.js", "src/ui/index.js");
});

test("hidden: ? is exactly one character and never /", () => {
  yes("a?c", "abc");
  no("a?c", "ac");
  no("a?c", "abbc");
  no("a?c", "a/c");
  yes("assets/icon-??.png", "assets/icon-32.png");
});

test("hidden: ** as a segment matches zero or more segments", () => {
  yes("a/**/b", "a/b");
  yes("a/**/b", "a/x/b");
  yes("a/**/b", "a/x/y/b");
  no("a/**/b", "a/xb");
  yes("**/*.js", "x.js");
  yes("**/*.js", "d/e/x.js");
  yes("src/**/*.test.js", "src/b.test.js");
  no("src/**/*.test.js", "lib/b.test.js");
  yes("**", "any/path/at/all");
});

test("hidden: a/** also matches a", () => {
  yes("a/**", "a");
  yes("a/**", "a/x/y");
  no("a/**", "ab");
  no("a/**", "b/a");
});

test("hidden: ** inside a segment acts as *", () => {
  yes("**.js", "b.js");
  no("**.js", "a/b.js");
  yes("a**b/c", "axxb/c");
  no("a**b/c", "ax/xb/c");
});

test("hidden: backslash escapes and other characters are literal", () => {
  yes("a\\*b", "a*b");
  no("a\\*b", "axb");
  yes("what\\?", "what?");
  no("what\\?", "whats");
  yes("a\\\\b", "a\\b");
  yes("a/\\*\\*/b", "a/**/b");
  no("a/\\*\\*/b", "a/x/b");
  no("a.js", "axjs");
  no("a+.js", "aa.js");
  yes("(a+b)[1].js", "(a+b)[1].js");
  no("^a$|b", "b");
});
