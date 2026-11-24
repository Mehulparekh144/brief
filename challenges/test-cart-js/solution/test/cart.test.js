import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { addItem, applyCoupon, removeItem, total } from "../src/cart.js";

const empty = () => ({ items: [], coupon: null });

describe("addItem()", () => {
  test("the same sku twice adds up the qty", () => {
    const cart = addItem(addItem(empty(), { sku: "mug", price: 1200, qty: 2 }), { sku: "mug", price: 1200, qty: 3 });
    assert.deepEqual(cart.items, [{ sku: "mug", price: 1200, qty: 5 }]);
  });
  test("qty 0 throws a RangeError", () => {
    assert.throws(() => addItem(empty(), { sku: "mug", price: 1200, qty: 0 }), RangeError);
  });
});

describe("removeItem()", () => {
  test("removes only that sku", () => {
    const cart = addItem(addItem(empty(), { sku: "mug", price: 1200 }), { sku: "tea", price: 500 });
    assert.deepEqual(removeItem(cart, "mug").items, [{ sku: "tea", price: 500, qty: 1 }]);
  });
});

describe("applyCoupon()", () => {
  test("ignores case and spaces", () => {
    assert.equal(applyCoupon(empty(), "  save10 ").coupon, "SAVE10");
  });
  test("an unknown code throws", () => {
    assert.throws(() => applyCoupon(empty(), "FREE"));
  });
});

describe("total()", () => {
  test("SAVE10 rounds the discount to the nearest cent", () => {
    const cart = applyCoupon(addItem(empty(), { sku: "mug", price: 1005 }), "SAVE10");
    assert.equal(total(cart), 904);
  });
  test("FIVEOFF never goes below 0", () => {
    const cart = applyCoupon(addItem(empty(), { sku: "pin", price: 300 }), "FIVEOFF");
    assert.equal(total(cart), 0);
  });
});
