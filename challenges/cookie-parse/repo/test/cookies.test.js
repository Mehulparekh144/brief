import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCookies } from "../src/cookies.js";

test("parses simple cookies", () => {
  assert.deepEqual({ ...parseCookies("sid=abc123; theme=dark") }, { sid: "abc123", theme: "dark" });
});

test("decodes percent-encoded values", () => {
  assert.deepEqual({ ...parseCookies("name=J%C3%BCrgen") }, { name: "Jürgen" });
});
