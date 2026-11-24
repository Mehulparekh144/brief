import assert from "node:assert/strict";
import { test } from "node:test";
import { splitBill } from "../src/bills.js";
import { split } from "../src/money/split.js";

test("an even split", () => {
  assert.deepEqual(split(100, [1, 1]), [50, 50]);
});

test("a bill by weight", () => {
  const bill = { total: 9000, people: [{ name: "Ada", weight: 1 }, { name: "Bob", weight: 2 }] };
  assert.deepEqual(splitBill(bill), ["Ada: $30.00", "Bob: $60.00"]);
});
