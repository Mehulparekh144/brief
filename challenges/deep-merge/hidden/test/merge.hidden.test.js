import assert from "node:assert/strict";
import { test } from "node:test";
import { merge } from "../src/merge.js";

const deepFreeze = (o) => {
  for (const v of Object.values(o)) if (v && typeof v === "object") deepFreeze(v);
  return Object.freeze(o);
};

test("hidden: arrays replace, they are not joined", () => {
  assert.deepEqual(merge({ tags: ["a", "b"] }, { tags: ["c"] }), { tags: ["c"] });
  assert.deepEqual(merge({ a: { x: 1 } }, { a: [1, 2] }), { a: [1, 2] });
  assert.deepEqual(merge({ a: [1, 2] }, { a: { x: 1 } }), { a: { x: 1 } });
});

test("hidden: undefined in source is skipped at every depth", () => {
  assert.deepEqual(merge({ a: 1, b: { c: 2 } }, { a: undefined, b: { c: undefined } }), { a: 1, b: { c: 2 } });
  assert.deepEqual(merge({}, { a: undefined, b: { c: undefined, d: 1 } }), { b: { d: 1 } });
});

test("hidden: null overwrites at any depth", () => {
  assert.deepEqual(merge({ a: { b: { c: 1 } } }, { a: { b: null } }), { a: { b: null } });
  assert.deepEqual(merge({ a: null }, { a: { x: 1 } }), { a: { x: 1 } });
});

test("hidden: target and source are not changed", () => {
  const target = deepFreeze({ a: { x: 1 }, list: [1, 2], n: 1 });
  const source = deepFreeze({ a: { y: 2 }, list: [3], n: undefined, m: null });
  assert.deepEqual(merge(target, source), { a: { x: 1, y: 2 }, list: [3], n: 1, m: null });
  assert.deepEqual(target, { a: { x: 1 }, list: [1, 2], n: 1 });
});

test("hidden: the result shares no plain object or array with the inputs", () => {
  const target = { a: { x: 1, deep: { k: 1 } }, list: [{ id: 1 }] };
  const source = { b: { y: 2 }, arr: [[1], { z: 1 }] };
  const r = merge(target, source);
  assert.notEqual(r.a, target.a);
  assert.notEqual(r.a.deep, target.a.deep);
  assert.notEqual(r.list, target.list);
  assert.notEqual(r.list[0], target.list[0]);
  assert.notEqual(r.b, source.b);
  assert.notEqual(r.arr, source.arr);
  assert.notEqual(r.arr[0], source.arr[0]);
  assert.notEqual(r.arr[1], source.arr[1]);
  r.a.deep.k = 9;
  r.list[0].id = 9;
  r.b.y = 9;
  r.arr[1].z = 9;
  assert.deepEqual(target, { a: { x: 1, deep: { k: 1 } }, list: [{ id: 1 }] });
  assert.deepEqual(source, { b: { y: 2 }, arr: [[1], { z: 1 }] });
});

test("hidden: other objects are kept by reference", () => {
  class Point {
    constructor(x) {
      this.x = x;
    }
  }
  const when = new Date(0);
  const p = new Point(1);
  const m = new Map([["k", 1]]);
  const r = merge({ when: new Date(5), keep: when, p: { x: 0, y: 0 }, m: { a: 1 } }, { when, p, m });
  assert.equal(r.when, when);
  assert.equal(r.keep, when);
  assert.equal(r.p, p);
  assert.equal(r.m, m);
});
