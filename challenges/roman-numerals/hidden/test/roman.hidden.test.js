import assert from "node:assert/strict";
import { test } from "node:test";
import { fromRoman, toRoman } from "../src/roman.js";

test("hidden: subtractive forms and the ends of the range", () => {
  const cases = { 1: "I", 4: "IV", 9: "IX", 14: "XIV", 40: "XL", 90: "XC", 400: "CD", 900: "CM", 3999: "MMMCMXCIX" };
  for (const [n, s] of Object.entries(cases)) assert.equal(toRoman(Number(n)), s);
});

test("hidden: fromRoman reads back every number from 1 to 3999", () => {
  for (let n = 1; n <= 3999; n++) assert.equal(fromRoman(toRoman(n)), n);
});

test("hidden: toRoman throws a RangeError outside 1 to 3999", () => {
  for (const n of [0, -1, 4000, 10000]) assert.throws(() => toRoman(n), RangeError, String(n));
});

test("hidden: toRoman throws a TypeError when n is not an integer", () => {
  for (const n of [3.5, NaN, Infinity, -Infinity, "12", null, undefined]) assert.throws(() => toRoman(n), TypeError, String(n));
});

test("hidden: fromRoman throws a TypeError for forms that are not standard", () => {
  for (const s of ["IIII", "VV", "IC", "XM", "IIV", "VX", "IVI", "MMMM", "", "X I"]) {
    assert.throws(() => fromRoman(s), TypeError, JSON.stringify(s));
  }
});

test("hidden: fromRoman is uppercase only", () => {
  for (const s of ["iv", "Xii", "mcmxciv"]) assert.throws(() => fromRoman(s), TypeError, s);
});

test("hidden: fromRoman throws a TypeError when s is not a string", () => {
  for (const s of [4, null, undefined, ["IV"]]) assert.throws(() => fromRoman(s), TypeError, String(s));
});
