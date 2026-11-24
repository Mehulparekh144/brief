import assert from "node:assert/strict";
import { test } from "node:test";
import { parseQuery } from "../src/query.js";

test("parses simple pairs", () => {
  assert.deepEqual(parseQuery("a=1&b=two"), { a: "1", b: "two" });
});

test("a leading ? is optional", () => {
  assert.deepEqual(parseQuery("?page=2&sort=name"), { page: "2", sort: "name" });
});
