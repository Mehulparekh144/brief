import assert from "node:assert/strict";
import { test } from "node:test";
import { merge } from "../src/intervals.js";

test("merges overlapping intervals", () => {
  assert.deepEqual(merge([[1, 3], [2, 6], [8, 10]]), [[1, 6], [8, 10]]);
});

test("sorts by start", () => {
  assert.deepEqual(merge([[8, 10], [1, 3]]), [[1, 3], [8, 10]]);
});
