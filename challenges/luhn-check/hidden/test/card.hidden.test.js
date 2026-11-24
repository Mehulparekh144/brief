import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCard } from "../src/card.js";

test("hidden: spaces and dashes are ignored wherever they are", () => {
  assert.equal(validateCard("4111 1111 1111 1111"), true);
  assert.equal(validateCard("4111-1111-1111-1111"), true);
  assert.equal(validateCard(" 4111-1111 1111--1111 "), true);
});

test("hidden: any other character makes the number invalid", () => {
  for (const s of ["4111.1111.1111.1111", "4111_1111_1111_1111", "+4111111111111111", "4111111111111111a", "4111\t1111\t1111\t1111", "4111\n111111111111"]) {
    assert.equal(validateCard(s), false, JSON.stringify(s));
  }
});

test("hidden: 13 to 19 digits", () => {
  assert.equal(validateCard("4111111111119"), true); // 13 digits
  assert.equal(validateCard("4111111111111111110"), true); // 19 digits
  assert.equal(validateCard("4111 1111 1111 1111 110"), true); // 19 digits with spaces
  assert.equal(validateCard("411111111117"), false); // 12 digits, Luhn ok
  assert.equal(validateCard("41111111111111111115"), false); // 20 digits, Luhn ok
  assert.equal(validateCard(""), false);
  assert.equal(validateCard(" - - "), false);
});

test("hidden: the Luhn checksum decides", () => {
  assert.equal(validateCard("378282246310005"), true);
  assert.equal(validateCard("378282246310006"), false);
  assert.equal(validateCard("5555555555554444"), true);
  assert.equal(validateCard("6011111111111117"), true);
  assert.equal(validateCard("4012888888881881"), true);
  assert.equal(validateCard("4012888888881882"), false);
});

test("hidden: input that is not a string returns false", () => {
  for (const v of [4111111111111111, null, undefined, ["4111111111111111"], {}]) {
    assert.equal(validateCard(v), false, String(v));
  }
});
