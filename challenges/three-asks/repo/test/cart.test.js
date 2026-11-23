import assert from "node:assert/strict";
import { test } from "node:test";
import { calcTotal } from "../src/cart.js";
import { checkout } from "../src/checkout.js";

test("adds tax to the subtotal", () => {
  assert.equal(calcTotal([{ price: 10, qty: 2 }]).amount, 21.6);
});

test("checkout returns the total for the user", () => {
  const result = checkout({ items: [{ price: 5, qty: 1 }] }, { id: "u1" });
  assert.equal(result.user, "u1");
  assert.equal(result.amount, 5.4);
});
