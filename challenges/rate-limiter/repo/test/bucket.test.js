import assert from "node:assert/strict";
import { test } from "node:test";
import { createBucket } from "../src/limits/bucket.js";

const fakeClock = () => {
  let t = 0;
  const now = () => t;
  now.advance = (ms) => {
    t += ms;
  };
  return now;
};

test("a drained bucket does not refill in 1 ms", () => {
  const now = fakeClock();
  const bucket = createBucket({ capacity: 2, refillPerSec: 1, now });
  assert.equal(bucket.allow(), true);
  assert.equal(bucket.allow(), true);
  now.advance(1);
  assert.equal(bucket.allow(), false);
});

test("a new bucket is full", () => {
  const bucket = createBucket({ capacity: 3, refillPerSec: 1, now: fakeClock() });
  assert.deepEqual([bucket.allow(), bucket.allow(), bucket.allow(), bucket.allow()], [true, true, true, false]);
});
