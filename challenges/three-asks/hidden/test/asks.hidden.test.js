import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import * as cart from "../src/cart.js";
import { checkout } from "../src/checkout.js";
import { config } from "../src/config.js";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const OLD_NAME = ["calc", "Total"].join("");

test("hidden: calculateTotal replaces the old name", () => {
  assert.equal(typeof cart.calculateTotal, "function");
  assert.equal(cart[OLD_NAME], undefined);
});

test("hidden: the old name is gone from src, test and README", () => {
  const files = ["README.md", ...readdirSync(new URL("src/", root)).map((f) => `src/${f}`), ...readdirSync(new URL("test/", root)).filter((f) => !f.includes("hidden")).map((f) => `test/${f}`)];
  for (const f of files) assert.ok(!read(f).includes(OLD_NAME), `${f} still says ${OLD_NAME}`);
  assert.ok(read("README.md").includes("calculateTotal"), "README should show calculateTotal");
});

test("hidden: default currency is EUR", () => {
  assert.equal(config.currency, "EUR");
  assert.equal(cart.calculateTotal([{ price: 10, qty: 1 }]).currency, "EUR");
});

test("hidden: discount applies before tax", () => {
  assert.equal(cart.calculateTotal([{ price: 100, qty: 1 }], { discount: 0.25 }).amount, 81);
  assert.equal(cart.calculateTotal([{ price: 100, qty: 1 }]).amount, 108);
});

test("hidden: discount outside 0-1 throws", () => {
  assert.throws(() => cart.calculateTotal([{ price: 1, qty: 1 }], { discount: 1.5 }));
  assert.throws(() => cart.calculateTotal([{ price: 1, qty: 1 }], { discount: -0.1 }));
});

test("hidden: checkout still works", () => {
  assert.equal(checkout({ items: [{ price: 5, qty: 1 }] }, { id: "u1" }).amount, 5.4);
});
