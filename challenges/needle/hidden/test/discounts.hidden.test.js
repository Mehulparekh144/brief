import assert from "node:assert/strict";
import { test } from "node:test";
import { addItem, createCart } from "../src/orders/cart.js";
import { checkout } from "../src/orders/checkout.js";
import { applyDiscount } from "../src/pricing/discounts.js";

test("hidden: spaces around a code are ignored", () => {
  assert.equal(applyDiscount(200, "  save25 "), 50);
});
test("hidden: mixed case works", () => {
  assert.equal(applyDiscount(100, "Welcome5"), 5);
});
test("hidden: unknown code gives no discount", () => {
  assert.equal(applyDiscount(100, "BOGUS"), 0);
  assert.equal(applyDiscount(100, "   "), 0);
});
test("hidden: minimum subtotal still applies", () => {
  assert.equal(applyDiscount(99, "SAVE25"), 0);
});
test("hidden: checkout with an unknown code does not crash", () => {
  const order = checkout(addItem(createCart(), "LMP-04"), { code: "nope", country: "DE" });
  assert.equal(order.discount, 0);
  assert.equal(order.total, 102.16);
});
