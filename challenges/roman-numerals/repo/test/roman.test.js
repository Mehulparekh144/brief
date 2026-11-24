import assert from "node:assert/strict";
import { test } from "node:test";
import { fromRoman, toRoman } from "../src/roman.js";

test("toRoman writes standard numerals", () => {
  assert.equal(toRoman(1994), "MCMXCIV");
  assert.equal(toRoman(2026), "MMXXVI");
});

test("fromRoman reads standard numerals", () => {
  assert.equal(fromRoman("MCMXCIV"), 1994);
  assert.equal(fromRoman("XLII"), 42);
});
