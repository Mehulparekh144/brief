import assert from "node:assert/strict";
import { test } from "node:test";
import { merge } from "../src/intervals.js";

test("hidden: touching intervals become one", () => {
  assert.deepEqual(merge([[1, 2], [2, 3]]), [[1, 3]]);
  assert.deepEqual(merge([[5, 6], [1, 5], [8, 9]]), [[1, 6], [8, 9]]);
});

test("hidden: an interval inside another does not shrink it", () => {
  assert.deepEqual(merge([[1, 10], [2, 3], [4, 5]]), [[1, 10]]);
  assert.deepEqual(merge([[2, 3], [1, 10]]), [[1, 10]]);
});

test("hidden: start after end throws a RangeError", () => {
  assert.throws(() => merge([[1, 2], [5, 1]]), { name: "RangeError", message: "bad interval [5, 1]" });
  assert.throws(() => merge([[-1, -3]]), { name: "RangeError", message: "bad interval [-1, -3]" });
});

test("hidden: an interval with start equal to end is valid", () => {
  assert.deepEqual(merge([[3, 3], [1, 2]]), [[1, 2], [3, 3]]);
  assert.deepEqual(merge([[2, 2], [0, 2]]), [[0, 2]]);
});

test("hidden: the input is not changed", () => {
  const input = Object.freeze([[5, 8], [1, 3], [2, 6]].map((i) => Object.freeze(i)));
  assert.deepEqual(merge(input), [[1, 8]]);
  assert.deepEqual(input, [[5, 8], [1, 3], [2, 6]]);
  const one = [[1, 2]];
  assert.notEqual(merge(one)[0], one[0]);
});

test("hidden: an empty list gives []", () => {
  assert.deepEqual(merge([]), []);
});
