import assert from "node:assert/strict";
import { test } from "node:test";
import { merge } from "../src/merge.js";

test("nested settings merge", () => {
  assert.deepEqual(merge({ ui: { theme: "light", font: 12 } }, { ui: { font: 14 } }), { ui: { theme: "light", font: 14 } });
});

test("null overwrites a value", () => {
  assert.deepEqual(merge({ proxy: { host: "a" } }, { proxy: null }), { proxy: null });
});
