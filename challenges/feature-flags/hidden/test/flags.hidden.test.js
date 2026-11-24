import assert from "node:assert/strict";
import { test } from "node:test";
import { checkoutVersion } from "../src/app/checkout.js";
import { searchBackend } from "../src/app/search.js";
import { fnv1a } from "../src/flags/hash.js";
import { isEnabled } from "../src/flags/isEnabled.js";

const users = Array.from({ length: 400 }, (_, i) => `user-${i + 1}`);
const expected = (flag, id, rollout) => fnv1a(`${flag}:${id}`) % 100 < rollout;

test("hidden: a flag at 0% is off for every user", () => {
  for (const id of users) assert.equal(isEnabled("beta-search", id, {}), false, id);
});
test("hidden: a 25% flag is on exactly when bucket < 25", () => {
  let on = 0;
  for (const id of users) {
    const got = isEnabled("new-checkout", id, {});
    assert.equal(got, expected("new-checkout", id, 25), id);
    if (got) on++;
  }
  assert.ok(on > 60 && on < 140, `${on} of 400 users`);
});
test("hidden: the same user always gets the same answer", () => {
  for (const id of users.slice(0, 50)) {
    const first = isEnabled("fast-export", id, {});
    for (let i = 0; i < 3; i++) assert.equal(isEnabled("fast-export", id, {}), first);
    assert.equal(first, expected("fast-export", id, 50), id);
  }
});
test("hidden: off turns a 100% flag off for everyone", () => {
  for (const id of users) assert.equal(isEnabled("dark-mode", id, { FLAG_DARK_MODE: "off" }), false, id);
});
test("hidden: off beats the rollout for a partial flag", () => {
  for (const id of users) assert.equal(checkoutVersion(id, { FLAG_NEW_CHECKOUT: "off" }), "v1", id);
});
test("hidden: other override values are ignored", () => {
  for (const id of users.slice(0, 50)) {
    assert.equal(isEnabled("dark-mode", id, { FLAG_DARK_MODE: "maybe" }), true, id);
    assert.equal(isEnabled("new-checkout", id, { FLAG_NEW_CHECKOUT: "" }), expected("new-checkout", id, 25), id);
  }
});
test("hidden: overrides use the flag's own name and unknown flags are off", () => {
  assert.equal(searchBackend("user-1", { FLAG_BETA_SEARCH: "on" }), "vector");
  assert.equal(searchBackend("user-1", { FLAG_NEW_CHECKOUT: "on" }), "keyword");
  assert.equal(isEnabled("no-such-flag", "user-1", {}), false);
});
