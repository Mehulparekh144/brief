import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCard } from "../src/card.js";

test("a valid Visa number passes", () => {
  assert.equal(validateCard("4111111111111111"), true);
});

test("a number with a wrong check digit fails", () => {
  assert.equal(validateCard("4111111111111112"), false);
});
