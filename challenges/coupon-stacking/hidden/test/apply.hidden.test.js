import assert from "node:assert/strict";
import { test } from "node:test";
import { addItem, createCart } from "../src/cart/cart.js";
import { checkout } from "../src/checkout.js";
import { applyCoupons } from "../src/coupons/apply.js";

const pct = (value) => ({ type: "percent", value });
const fixed = (value) => ({ type: "fixed", value });
const ship = (value) => ({ type: "shipping", value });

test("hidden: only the best percent coupon counts", () => {
  assert.deepEqual(applyCoupons({ items: 10000, shipping: 0 }, [pct(10), pct(25), pct(5)]), { items: 7500, shipping: 0, total: 7500 });
});
test("hidden: the coupon order does not matter", () => {
  const coupons = [fixed(700), pct(20), ship(300), fixed(500), pct(10)];
  const expected = { items: 6800, shipping: 200, total: 7000 };
  assert.deepEqual(applyCoupons({ items: 10000, shipping: 500 }, coupons), expected);
  assert.deepEqual(applyCoupons({ items: 10000, shipping: 500 }, [...coupons].reverse()), expected);
});
test("hidden: items never go below 0 and extra does not touch shipping", () => {
  assert.deepEqual(applyCoupons({ items: 1000, shipping: 500 }, [fixed(1500)]), { items: 0, shipping: 500, total: 500 });
  assert.deepEqual(applyCoupons({ items: 1000, shipping: 0 }, [fixed(600), fixed(600)]), { items: 0, shipping: 0, total: 0 });
});
test("hidden: a shipping coupon only reduces shipping", () => {
  assert.deepEqual(applyCoupons({ items: 4000, shipping: 300 }, [ship(500)]), { items: 4000, shipping: 0, total: 4000 });
});
test("hidden: a shipping coupon on free shipping changes nothing", () => {
  assert.deepEqual(applyCoupons({ items: 6000, shipping: 0 }, [ship(1500)]), { items: 6000, shipping: 0, total: 6000 });
});
test("hidden: the percent discount rounds to the nearest cent", () => {
  assert.deepEqual(applyCoupons({ items: 999, shipping: 0 }, [pct(15)]), { items: 849, shipping: 0, total: 849 });
  assert.deepEqual(applyCoupons({ items: 1001, shipping: 0 }, [pct(15)]), { items: 851, shipping: 0, total: 851 });
});
test("hidden: the percent applies to the full items amount, then fixed coupons", () => {
  assert.deepEqual(applyCoupons({ items: 10000, shipping: 0 }, [fixed(500), fixed(700), pct(20)]), { items: 6800, shipping: 0, total: 6800 });
});
test("hidden: checkout skips expired coupons and applies the rules", () => {
  const cart = addItem(createCart(), "LMP-04");
  const order = checkout(cart, { codes: ["tenoff", "spring15", "save10", "freeship"], country: "DE", now: new Date("2026-11-23T12:00:00Z") });
  assert.deepEqual(order, { codes: ["TENOFF", "SAVE10", "FREESHIP"], subtotal: 4999, items: 3499, shipping: 199, total: 3698 });
});
