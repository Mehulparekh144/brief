import assert from "node:assert/strict";
import { test } from "node:test";
import { split } from "../src/money/split.js";

const sum = (xs) => xs.reduce((a, b) => a + b, 0);

test("hidden: shares are whole cents that add up to the total", () => {
  for (const ratios of [[1], [1, 1], [1, 1, 1], [1, 2, 3], [5, 3, 2], [1, 1, 1, 1, 1, 1, 1], [3, 7], [0.5, 0.25, 0.25]]) {
    for (let cents = 0; cents <= 250; cents++) {
      const shares = split(cents, ratios);
      assert.equal(shares.length, ratios.length);
      assert.equal(sum(shares), cents, `split(${cents}, ${JSON.stringify(ratios)})`);
      shares.forEach((s, i) => {
        assert.ok(Number.isInteger(s) && s >= 0, `share ${s} is not whole cents`);
        assert.ok(Math.abs(s - (cents * ratios[i]) / sum(ratios)) < 1, `share ${s} is too far from its exact value`);
      });
    }
  }
});

test("hidden: left-over cents go to the largest fractional parts", () => {
  assert.deepEqual(split(100, [1, 1, 1]), [34, 33, 33]);
  assert.deepEqual(split(5, [1, 1, 1]), [2, 2, 1]);
  assert.deepEqual(split(100, [1, 1, 5]), [14, 14, 72]);
  assert.deepEqual(split(1000, [1, 6]), [143, 857]);
  assert.deepEqual(split(10, [1, 2]), [3, 7]);
});

test("hidden: on a tie the earlier index gets the cent first", () => {
  assert.deepEqual(split(2, [1, 3]), [1, 1]);
  assert.deepEqual(split(1, [1, 1]), [1, 0]);
  assert.deepEqual(split(1, [2, 2, 1]), [1, 0, 0]);
  assert.deepEqual(split(100, [3, 3, 1]), [43, 43, 14]);
});

test("hidden: fractional ratios and a single ratio", () => {
  assert.deepEqual(split(101, [0.5, 0.25, 0.25]), [51, 25, 25]);
  assert.deepEqual(split(999, [7]), [999]);
  assert.deepEqual(split(0, [1, 2]), [0, 0]);
});

test("hidden: ratios must be positive numbers", () => {
  for (const ratios of [[], [0, 1], [-1, 2], [NaN], [Infinity, 1], ["1", 1], [null], [1, undefined], "1,2", undefined]) {
    assert.throws(() => split(100, ratios), undefined, JSON.stringify(ratios));
  }
});

test("hidden: cents must be a whole number, 0 or more", () => {
  for (const cents of [10.5, -1, "100", NaN, Infinity, null]) {
    assert.throws(() => split(cents, [1, 1]), undefined, String(cents));
  }
});
