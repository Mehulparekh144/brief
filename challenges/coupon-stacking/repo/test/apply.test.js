import assert from "node:assert/strict";
import { test } from "node:test";
import { applyCoupons } from "../src/coupons/apply.js";

test("the percent coupon applies before fixed coupons", () => {
  const r = applyCoupons({ items: 10000, shipping: 500 }, [
    { type: "fixed", value: 1000 },
    { type: "percent", value: 10 },
  ]);
  assert.deepEqual(r, { items: 8000, shipping: 500, total: 8500 });
});

test("no coupons change nothing", () => {
  assert.deepEqual(applyCoupons({ items: 2500, shipping: 499 }, []), { items: 2500, shipping: 499, total: 2999 });
});
