import assert from "node:assert/strict";
import { test } from "node:test";
import { slugify } from "../src/slugify.js";

test("smoke: a simple title", () => {
  assert.equal(slugify("Hello World"), "hello-world");
});
