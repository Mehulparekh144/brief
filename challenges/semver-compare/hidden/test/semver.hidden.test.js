import assert from "node:assert/strict";
import { test } from "node:test";
import { compare } from "../src/semver.js";

test("hidden: returns exactly -1, 0 or 1", () => {
  assert.equal(compare("1.0.0", "5.0.0"), -1);
  assert.equal(compare("9.0.0", "2.0.0"), 1);
  assert.equal(compare("1.0.0-30", "1.0.0-2"), 1);
  assert.equal(compare("2.3.4", "2.3.4"), 0);
});

test("hidden: a leading v is allowed", () => {
  assert.equal(compare("v1.2.3", "1.2.3"), 0);
  assert.equal(compare("v2.0.0", "v10.0.0"), -1);
  assert.equal(compare("1.0.0", "v1.0.0-rc.1"), 1);
});

test("hidden: build metadata is ignored", () => {
  assert.equal(compare("1.0.0+build.1", "1.0.0+build.2"), 0);
  assert.equal(compare("1.0.0-alpha+x.7", "1.0.0-alpha"), 0);
  assert.equal(compare("v1.2.3+exp-sha.5114f85", "1.2.3"), 0);
  assert.equal(compare("1.0.0+zzz", "1.0.1"), -1);
});

test("hidden: a prerelease is lower than its release", () => {
  assert.equal(compare("1.0.0-alpha", "1.0.0"), -1);
  assert.equal(compare("1.0.0", "1.0.0-rc.1"), 1);
  assert.equal(compare("1.0.1-alpha", "1.0.0"), 1);
  assert.equal(compare("1.2.0-beta", "1.1.9"), 1);
});

test("hidden: prerelease identifiers follow the semver order", () => {
  const order = ["1.0.0-alpha", "1.0.0-alpha.1", "1.0.0-alpha.beta", "1.0.0-beta", "1.0.0-beta.2", "1.0.0-beta.11", "1.0.0-rc.1", "1.0.0"];
  for (let i = 0; i + 1 < order.length; i++) {
    assert.equal(compare(order[i], order[i + 1]), -1, `${order[i]} < ${order[i + 1]}`);
    assert.equal(compare(order[i + 1], order[i]), 1, `${order[i + 1]} > ${order[i]}`);
  }
  const shuffled = [order[5], order[0], order[7], order[3], order[1], order[6], order[2], order[4]];
  assert.deepEqual(shuffled.sort(compare), order);
});

test("hidden: numeric identifiers compare as numbers and come before text", () => {
  assert.equal(compare("1.0.0-2", "1.0.0-10"), -1);
  assert.equal(compare("1.0.0-alpha.9", "1.0.0-alpha.10"), -1);
  assert.equal(compare("1.0.0-1", "1.0.0-alpha"), -1);
  assert.equal(compare("1.0.0-11", "1.0.0-1a"), -1);
  assert.equal(compare("1.0.0-Beta", "1.0.0-alpha"), -1);
  assert.equal(compare("1.0.0-alpha.Z", "1.0.0-alpha.a"), -1);
});

test("hidden: invalid versions throw a TypeError", () => {
  assert.throws(() => compare("1.2", "1.2.0"), { name: "TypeError", message: "invalid version: 1.2" });
  assert.throws(() => compare("1.0.0", "1.2.x"), { name: "TypeError", message: "invalid version: 1.2.x" });
  for (const bad of ["", "v", "1.2.3-", "1.2.3.4", "1.2.3+", " 1.2.3", "1.2.3-alpha..1"]) {
    assert.throws(() => compare(bad, "1.0.0"), TypeError, JSON.stringify(bad));
  }
});
