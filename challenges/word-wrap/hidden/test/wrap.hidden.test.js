import assert from "node:assert/strict";
import { test } from "node:test";
import { wrap } from "../src/wrap.js";

test("hidden: runs of spaces and tabs collapse", () => {
  assert.equal(wrap("a   b \t c", 80), "a b c");
  assert.equal(wrap("   lead and trail   ", 80), "lead and trail");
});

test("hidden: no line starts or ends with a space", () => {
  assert.equal(wrap("aaa bbb    ccc  ddd", 7), "aaa bbb\nccc ddd");
  assert.equal(wrap("aaa    bbb", 3), "aaa\nbbb");
});

test("hidden: long words start a new line and are cut at width", () => {
  assert.equal(wrap("abcdefghij", 4), "abcd\nefgh\nij");
  assert.equal(wrap("abcdefgh", 4), "abcd\nefgh");
  assert.equal(wrap("hi abcdefghijk yo", 5), "hi\nabcde\nfghij\nk yo");
});

test("hidden: paragraphs keep exactly one blank line between them", () => {
  assert.equal(wrap("one two\n\n\n\nthree", 80), "one two\n\nthree");
  assert.equal(wrap("a\n  \t \nb", 80), "a\n\nb");
  assert.equal(wrap("aaa bbb\n\nccc ddd", 3), "aaa\nbbb\n\nccc\nddd");
});

test("hidden: a single newline inside a paragraph is a space", () => {
  assert.equal(wrap("one\ntwo three\nfour", 80), "one two three four");
  assert.equal(wrap("one\ntwo three\nfour", 9), "one two\nthree\nfour");
});

test("hidden: empty or blank text gives an empty string", () => {
  assert.equal(wrap("", 10), "");
  assert.equal(wrap(" \n\n\t\n ", 10), "");
  assert.equal(wrap("\n\nhello\n\n", 10), "hello");
});
