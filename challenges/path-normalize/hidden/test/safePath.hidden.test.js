import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "../src/index.js";
import { safeJoin } from "../src/lib/safePath.js";

const ROOT = "/srv/app/public";

test("hidden: absolute paths are rejected", () => {
  for (const p of ["/etc/passwd", "/srv/app/public-backup/db.sqlite", "/srv/app/public/index.html"]) {
    assert.throws(() => safeJoin(ROOT, p), Error, p);
  }
});
test("hidden: any .. segment is rejected", () => {
  for (const p of ["../../etc/passwd", "docs/../index.html", "a/b/..", ".."]) {
    assert.throws(() => safeJoin(ROOT, p), Error, p);
  }
});
test("hidden: percent-encoded traversal is rejected", () => {
  for (const p of ["%2e%2e/%2e%2e/etc/passwd", ".%2E/secret.txt", "..%2Fetc%2Fpasswd", "%2Fetc%2Fpasswd", "docs/%2E%2E/%2E%2E/x"]) {
    assert.throws(() => safeJoin(ROOT, p), Error, p);
  }
});
test("hidden: nested folders are allowed", () => {
  assert.equal(safeJoin(ROOT, "docs/guides/intro.md"), "/srv/app/public/docs/guides/intro.md");
});
test("hidden: names with dots that are not .. are allowed", () => {
  assert.equal(safeJoin(ROOT, "a..b.txt"), "/srv/app/public/a..b.txt");
  assert.equal(safeJoin(ROOT, "..hidden"), "/srv/app/public/..hidden");
  assert.equal(safeJoin(ROOT, ".well-known/security.txt"), "/srv/app/public/.well-known/security.txt");
});
test("hidden: the path is percent-decoded once", () => {
  assert.equal(safeJoin(ROOT, "my%20notes.txt"), "/srv/app/public/my notes.txt");
  assert.equal(safeJoin(ROOT, "docs/caf%C3%A9.md"), "/srv/app/public/docs/café.md");
});
test("hidden: the server blocks the reported requests and serves good ones", () => {
  const files = new Map([
    ["/srv/app/public/index.html", "<h1>hi</h1>"],
    ["/srv/app/public/my notes.txt", "notes"],
    ["/srv/app/public-backup/db.sqlite", "SECRET"],
  ]);
  const server = createServer({ files });
  const get = (url) => server({ method: "GET", url });
  assert.equal(get("/static/../public-backup/db.sqlite").status, 403);
  assert.equal(get("/static//srv/app/public-backup/db.sqlite").status, 403);
  assert.equal(get("/static/%2e%2e/public-backup/db.sqlite").status, 403);
  assert.deepEqual(get("/static/my%20notes.txt"), { status: 200, headers: { "content-type": "text/plain" }, body: "notes" });
  assert.equal(get("/static/index.html").status, 200);
  assert.equal(get("/static/missing.txt").status, 404);
});
