import assert from "node:assert/strict";
import { test } from "node:test";
import { addItem, total } from "../src/cart.js";

test("smoke: one item", () => {
  const cart = addItem({ items: [], coupon: null }, { sku: "mug", price: 1200 });
  assert.equal(total(cart), 1200);
});
