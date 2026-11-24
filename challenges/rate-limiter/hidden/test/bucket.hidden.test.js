import assert from "node:assert/strict";
import { test } from "node:test";
import { createApp } from "../src/index.js";
import { createBucket } from "../src/limits/bucket.js";

const fakeClock = () => {
  let t = 1_700_000_000_000;
  const now = () => t;
  now.advance = (ms) => {
    t += ms;
  };
  return now;
};
const drained = (capacity, refillPerSec) => {
  const now = fakeClock();
  const bucket = createBucket({ capacity, refillPerSec, now });
  for (let i = 0; i < capacity; i++) bucket.allow();
  return { now, bucket };
};

test("hidden: one token per second at refillPerSec 1", () => {
  const { now, bucket } = drained(1, 1);
  now.advance(999);
  assert.equal(bucket.allow(), false);
  now.advance(1);
  assert.equal(bucket.allow(), true);
  assert.equal(bucket.allow(), false);
});
test("hidden: refillPerSec 2 gives a token every 500 ms", () => {
  const { now, bucket } = drained(4, 2);
  now.advance(500);
  assert.equal(bucket.allow(), true);
  assert.equal(bucket.allow(), false);
  now.advance(1000);
  assert.deepEqual([bucket.allow(), bucket.allow(), bucket.allow()], [true, true, false]);
});
test("hidden: a long idle time never goes past capacity", () => {
  const { now, bucket } = drained(3, 1);
  now.advance(60 * 60 * 1000);
  assert.equal(bucket.available(), 3);
  assert.deepEqual([bucket.allow(), bucket.allow(), bucket.allow(), bucket.allow()], [true, true, true, false]);
});
test("hidden: half a token is not enough, and a denial takes nothing", () => {
  const { now, bucket } = drained(1, 1);
  now.advance(500);
  assert.equal(bucket.allow(), false);
  now.advance(500);
  assert.equal(bucket.allow(), true);
});
test("hidden: part tokens add up", () => {
  const { now, bucket } = drained(2, 1);
  for (let i = 0; i < 3; i++) {
    now.advance(250);
    assert.equal(bucket.allow(), false);
  }
  now.advance(250);
  assert.equal(bucket.allow(), true);
});
test("hidden: each API key has its own bucket", () => {
  const now = fakeClock();
  const app = createApp({ now });
  for (let i = 0; i < 5; i++) assert.equal(app({ apiKey: "a" }).status, 200);
  assert.equal(app({ apiKey: "a" }).status, 429);
  assert.equal(app({ apiKey: "b" }).status, 200);
});
test("hidden: the gateway lets one more request through per second on the free plan", () => {
  const now = fakeClock();
  const app = createApp({ now });
  for (let i = 0; i < 5; i++) app({ apiKey: "a" });
  now.advance(10);
  assert.equal(app({ apiKey: "a" }).status, 429);
  now.advance(990);
  assert.equal(app({ apiKey: "a" }).status, 200);
  assert.equal(app({ apiKey: "a" }).status, 429);
});
