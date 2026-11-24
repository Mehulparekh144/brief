import assert from "node:assert/strict";
import { test } from "node:test";
import { rank } from "../src/rank.js";

test("highest score ranks first", () => {
  const out = rank([
    { name: "Ann", score: 10 },
    { name: "Bo", score: 30 },
    { name: "Cy", score: 20 },
  ]);
  assert.deepEqual(out, [
    { rank: 1, name: "Bo", score: 30 },
    { rank: 2, name: "Cy", score: 20 },
    { rank: 3, name: "Ann", score: 10 },
  ]);
});
