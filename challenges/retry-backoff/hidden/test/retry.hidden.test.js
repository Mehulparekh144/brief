import assert from "node:assert/strict";
import { test } from "node:test";
import { RETRY_DEFAULTS } from "../src/config.js";
import { createClient } from "../src/http/client.js";
import { retry } from "../src/lib/retry.js";

const recorder = () => {
  const waits = [];
  const sleep = async (ms) => {
    waits.push(ms);
  };
  return { waits, sleep };
};
const failing = () => {
  let n = 0;
  const fn = async () => {
    throw new Error(`fail ${n++}`);
  };
  fn.calls = () => n;
  return fn;
};

test("hidden: waits double", async () => {
  const { waits, sleep } = recorder();
  await assert.rejects(retry(failing(), { retries: 3, baseMs: 100, maxMs: 10_000, sleep }));
  assert.deepEqual(waits, [100, 200, 400]);
});
test("hidden: waits never pass maxMs", async () => {
  const { waits, sleep } = recorder();
  await assert.rejects(retry(failing(), { retries: 5, baseMs: 100, maxMs: 500, sleep }));
  assert.deepEqual(waits, [100, 200, 400, 500, 500]);
});
test("hidden: no wait after a success", async () => {
  const { waits, sleep } = recorder();
  let calls = 0;
  const fn = async () => {
    if (++calls < 3) throw new Error("down");
    return calls;
  };
  assert.equal(await retry(fn, { retries: 5, baseMs: 50, maxMs: 10_000, sleep }), 3);
  assert.deepEqual(waits, [50, 100]);
});
test("hidden: retries 0 means one call and no wait", async () => {
  const { waits, sleep } = recorder();
  const fn = failing();
  await assert.rejects(retry(fn, { retries: 0, baseMs: 100, maxMs: 1000, sleep }), { message: "fail 0" });
  assert.equal(fn.calls(), 1);
  assert.deepEqual(waits, []);
});
test("hidden: the last error is thrown as it is", async () => {
  const errors = [new Error("a"), new Error("b"), new Error("c")];
  let i = 0;
  const fn = async () => {
    throw errors[i++];
  };
  const { sleep } = recorder();
  await assert.rejects(retry(fn, { retries: 2, baseMs: 1, maxMs: 10, sleep }), (err) => err === errors[2]);
});
test("hidden: the client retries 503 and then succeeds", async () => {
  const { waits, sleep } = recorder();
  const replies = [{ status: 503 }, { status: 503 }, { status: 200, body: '{"high":21}' }];
  const client = createClient({ transport: async () => replies.shift(), retryOptions: { ...RETRY_DEFAULTS, sleep } });
  assert.deepEqual(await client.getJson("/forecast/Oslo"), { high: 21 });
  assert.deepEqual(waits, [200, 400]);
});
test("hidden: the client gives up with the HttpError", async () => {
  const { waits, sleep } = recorder();
  let calls = 0;
  const transport = async () => {
    calls++;
    return { status: 503 };
  };
  const client = createClient({ transport, retryOptions: { ...RETRY_DEFAULTS, sleep } });
  await assert.rejects(client.getJson("/forecast/Oslo"), { name: "HttpError", status: 503 });
  assert.equal(calls, 4);
  assert.deepEqual(waits, [200, 400, 800]);
});
