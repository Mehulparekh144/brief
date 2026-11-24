import assert from "node:assert/strict";
import { test } from "node:test";
import { retry } from "../src/lib/retry.js";

const noSleep = async () => {};

test("retries: 2 means 3 calls", async () => {
  let calls = 0;
  const fn = async () => {
    calls++;
    throw new Error("down");
  };
  await assert.rejects(retry(fn, { retries: 2, baseMs: 1, sleep: noSleep }));
  assert.equal(calls, 3);
});

test("returns the first success", async () => {
  let calls = 0;
  const fn = async () => {
    calls++;
    if (calls < 2) throw new Error("down");
    return "ok";
  };
  assert.equal(await retry(fn, { retries: 3, baseMs: 1, sleep: noSleep }), "ok");
  assert.equal(calls, 2);
});
