import assert from "node:assert/strict";
import { test } from "node:test";
import { listPosts } from "../src/api/routes.js";
import { paginate } from "../src/lib/paginate.js";

const list = Array.from({ length: 23 }, (_, i) => i + 1);

test("hidden: page 2 holds items 11 to 20", () => {
  const r = paginate(list, 2, 10);
  assert.deepEqual(r.items, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  assert.equal(r.page, 2);
});
test("hidden: the last page is partial", () => {
  assert.deepEqual(paginate(list, 3, 10).items, [21, 22, 23]);
  assert.deepEqual(paginate(list, 5, 5).items, [21, 22, 23]);
});
test("hidden: a page past the end is empty and keeps its number", () => {
  const r = paginate(list, 4, 10);
  assert.deepEqual(r.items, []);
  assert.equal(r.page, 4);
  assert.equal(r.totalPages, 3);
  assert.deepEqual(paginate(list, 99, 10).items, []);
});
test("hidden: totalPages rounds up", () => {
  assert.equal(paginate(list, 1, 10).totalPages, 3);
  assert.equal(paginate(list.slice(0, 20), 1, 10).totalPages, 2);
  assert.equal(paginate(list.slice(0, 5), 1, 10).totalPages, 1);
  assert.equal(paginate(list, 1, 1).totalPages, 23);
});
test("hidden: an empty list has no pages", () => {
  assert.deepEqual(paginate([], 1, 10), { items: [], page: 1, size: 10, total: 0, totalPages: 0 });
});
test("hidden: the posts route pages newest first", () => {
  assert.deepEqual(listPosts({ page: "1", size: "5" }).items.map((p) => p.id), [23, 22, 21, 20, 19]);
  const last = listPosts({ page: "3" });
  assert.deepEqual(last.items.map((p) => p.id), [3, 2, 1]);
  assert.equal(last.totalPages, 3);
});
