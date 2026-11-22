import assert from "node:assert/strict";
import { test } from "node:test";
import { addItem, createCart } from "../src/orders/cart.js";
import { checkout } from "../src/orders/checkout.js";

const cart = () => addItem(createCart(), "TEE-02", 5); // subtotal 110

test("checkout without a code", () => {
  assert.equal(checkout(cart()).discount, 0);
});

test("save10 takes 10% off", () => {
  assert.equal(checkout(cart(), { code: "save10" }).discount, 11);
});

test("codes ignore letter case", () => {
  assert.equal(checkout(cart(), { code: "SAVE10" }).discount, 11);
});
