import assert from "node:assert/strict";
import { test } from "node:test";
import { safeJoin } from "../src/lib/safePath.js";

const ROOT = "/srv/app/public";

test("a sibling folder with the same prefix is rejected", () => {
  assert.throws(() => safeJoin(ROOT, "../public-backup/db.sqlite"));
});

test("a plain file name joins onto root", () => {
  assert.equal(safeJoin(ROOT, "index.html"), "/srv/app/public/index.html");
});
