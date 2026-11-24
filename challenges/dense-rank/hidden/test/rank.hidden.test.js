import assert from "node:assert/strict";
import { test } from "node:test";
import { rank } from "../src/rank.js";

const ranks = (scores) => rank(scores.map((score, i) => ({ name: `p${i}`, score }))).map((r) => r.rank);
const names = (players) => rank(players).map((r) => r.name);

test("hidden: equal scores share a rank", () => {
  assert.deepEqual(ranks([100, 90, 90, 80]), [1, 2, 2, 3]);
});

test("hidden: ranks stay dense after several ties", () => {
  assert.deepEqual(ranks([30, 50, 10, 50, 40, 30, 50]), [1, 1, 1, 2, 3, 3, 4]);
});

test("hidden: ties are sorted by name, ignoring case", () => {
  const out = names([
    { name: "zoe", score: 5 },
    { name: "Adam", score: 5 },
    { name: "bob", score: 5 },
    { name: "Carl", score: 7 },
    { name: "carla", score: 5 },
  ]);
  assert.deepEqual(out, ["Carl", "Adam", "bob", "carla", "zoe"]);
});

test("hidden: names that are equal ignoring case keep their input order", () => {
  assert.deepEqual(names([{ name: "bob", score: 1 }, { name: "Bob", score: 1 }]), ["bob", "Bob"]);
  assert.deepEqual(names([{ name: "Bob", score: 1 }, { name: "bob", score: 1 }]), ["Bob", "bob"]);
});

test("hidden: each item has only rank, name and score", () => {
  const out = rank([
    { id: 7, name: "Bo", score: 3, team: "red" },
    { id: 8, name: "Ann", score: 3, team: "blue" },
  ]);
  assert.deepEqual(out, [
    { rank: 1, name: "Ann", score: 3 },
    { rank: 1, name: "Bo", score: 3 },
  ]);
});
