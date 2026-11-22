import assert from "node:assert/strict";
import { test } from "node:test";
import { addItem, createCart, removeItem, subtotal } from "../src/orders/cart.js";

test("adds and merges items", () => {
  const cart = addItem(addItem(createCart(), "MUG-01", 2), "MUG-01");
  assert.equal(cart.items.length, 1);
  assert.equal(subtotal(cart), 37.5);
});

test("removes items", () => {
  assert.equal(removeItem(addItem(createCart(), "TEE-02"), "TEE-02").items.length, 0);
});
