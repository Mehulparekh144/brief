import assert from "node:assert/strict";
import { test } from "node:test";
import { isEnabled } from "../src/flags/isEnabled.js";

test("a flag at 100% is on for every user", () => {
  for (let id = 1; id <= 50; id++) assert.equal(isEnabled("dark-mode", `u${id}`, {}), true, `u${id}`);
});

test("FLAG_BETA_SEARCH=on turns a 0% flag on", () => {
  assert.equal(isEnabled("beta-search", "u1", { FLAG_BETA_SEARCH: "on" }), true);
});
