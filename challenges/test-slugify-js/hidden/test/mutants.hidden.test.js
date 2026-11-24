// Hidden check: the user's test/slugify.test.js must pass on the real code and fail on each broken version.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const USER_TEST = "test/slugify.test.js";
const SOURCE_FILE = "src/slugify.js";
const SOURCE_SHA256 = "e54be0fb9f25557347003b53b07a7a077945a78b34b76865b5dece9d9afb5d68";
const SOURCE = readFileSync(join(ROOT, SOURCE_FILE), "utf8");
const MUTANTS = {
  "no lower-casing": ["    .toLowerCase()\n", ""],
  "accents not removed": ['.normalize("NFKD")', '.normalize("NFC")'],
  "runs not merged": ["/[^a-z0-9]+/g", "/[^a-z0-9]/g"],
  "leading hyphen kept": ['.replace(/^-+|-+$/g, "")', '.replace(/-+$/g, "")'],
  "cut at 41 characters": ["const MAX_LENGTH = 40;", "const MAX_LENGTH = 41;"],
  "hyphen after the cut kept": ['slug.slice(0, MAX_LENGTH).replace(/-+$/, "")', "slug.slice(0, MAX_LENGTH)"],
};

/** Runs only the user's test file, in a copy of the repo with `source` as src/slugify.js. True when it passes. */
function userTestsPass(source) {
  const dir = mkdtempSync(join(tmpdir(), "mutant-"));
  try {
    cpSync(join(ROOT, "package.json"), join(dir, "package.json"));
    cpSync(join(ROOT, "src"), join(dir, "src"), { recursive: true });
    cpSync(join(ROOT, "test"), join(dir, "test"), { recursive: true });
    writeFileSync(join(dir, SOURCE_FILE), source);
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT; // set by the outer runner; the nested run must behave like a normal one
    const r = spawnSync(process.execPath, ["--test", USER_TEST], { cwd: dir, env, timeout: 60_000 });
    return r.status === 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("hidden: test/slugify.test.js exists", () => {
  assert.ok(existsSync(join(ROOT, USER_TEST)), "test/slugify.test.js is missing");
});

test("hidden: src/slugify.js is unchanged", () => {
  assert.equal(createHash("sha256").update(SOURCE).digest("hex"), SOURCE_SHA256, "src/slugify.js was changed");
});

test("hidden: your tests pass on the real slugify()", () => {
  assert.ok(existsSync(join(ROOT, USER_TEST)), "test/slugify.test.js is missing");
  assert.ok(userTestsPass(SOURCE), "your tests fail on the real src/slugify.js");
});

test("hidden: your tests catch every broken slugify()", () => {
  assert.ok(existsSync(join(ROOT, USER_TEST)), "test/slugify.test.js is missing");
  const survived = [];
  for (const [name, [from, to]] of Object.entries(MUTANTS)) {
    assert.ok(SOURCE.includes(from), `mutant setup failed: ${name}`);
    if (userTestsPass(SOURCE.replace(from, to))) survived.push(name);
  }
  assert.deepEqual(survived, [], `your tests did not catch: ${survived.join(", ")}`);
});
