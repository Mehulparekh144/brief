import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "../src/slugify.js";

test("lower case", () => assert.equal(slugify("Hello World"), "hello-world"));
test("accents become plain letters", () => assert.equal(slugify("Crème Brûlée"), "creme-brulee"));
test("a run of other characters becomes one hyphen", () => assert.equal(slugify("a  &  b"), "a-b"));
test("no hyphen at the start or end", () => assert.equal(slugify("  ¡Hola!  "), "hola"));
test("at most 40 characters", () => assert.equal(slugify("a".repeat(50)), "a".repeat(40)));
test("a cut that ends on a hyphen drops it", () => assert.equal(slugify("a".repeat(39) + " bcd"), "a".repeat(39)));
