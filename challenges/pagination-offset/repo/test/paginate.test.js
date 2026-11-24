import assert from "node:assert/strict";
import { test } from "node:test";
import { paginate } from "../src/lib/paginate.js";

const list = Array.from({ length: 23 }, (_, i) => i + 1);

test("page 1 starts at the first item", () => {
  assert.deepEqual(paginate(list, 1, 10).items, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("size and total are returned", () => {
  const r = paginate(list, 1, 10);
  assert.equal(r.size, 10);
  assert.equal(r.total, 23);
});
