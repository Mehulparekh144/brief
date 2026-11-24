// Hidden check: the user's test/cart.test.js must use one describe() per function, pass on the real code and fail on each broken version.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const USER_TEST = "test/cart.test.js";
const SOURCE_FILE = "src/cart.js";
const SOURCE_SHA256 = "f0eb1227938c0cdbe4c0bcf05adb32c77c0dffd29ca51b4a91b9c59231d66a36";
const SOURCE = readFileSync(join(ROOT, SOURCE_FILE), "utf8");
const BLOCKS = ["addItem()", "removeItem()", "applyCoupon()", "total()"];
const MUTANTS = {
  "same sku replaces the qty": ["qty: it.qty + qty", "qty: qty"],
  "qty 0 allowed": ["qty < 1", "qty < 0"],
  "removeItem keeps the wrong items": ["it.sku !== sku", "it.sku === sku"],
  "coupon code is case-sensitive": ["String(code).trim().toUpperCase()", "String(code).trim()"],
  "discount rounded down": ["Math.round(", "Math.floor("],
  "total can go below 0": ["return Math.max(0, subtotal - discount);", "return subtotal - discount;"],
};

/** Runs only the user's test file, in a copy of the repo with `source` as src/cart.js. True when it passes. */
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

test("hidden: test/cart.test.js exists", () => {
  assert.ok(existsSync(join(ROOT, USER_TEST)), "test/cart.test.js is missing");
});

test("hidden: one describe() block per function", () => {
  const text = readFileSync(join(ROOT, USER_TEST), "utf8");
  const titles = [...text.matchAll(/\bdescribe\(\s*(["'`])(.*?)\1/g)].map((m) => m[2]);
  for (const name of BLOCKS) {
    assert.equal(titles.filter((t) => t === name).length, 1, `need exactly one describe("${name}", ...); found: ${JSON.stringify(titles)}`);
  }
});

test("hidden: src/cart.js is unchanged and your tests pass on it", () => {
  assert.equal(createHash("sha256").update(SOURCE).digest("hex"), SOURCE_SHA256, "src/cart.js was changed");
  assert.ok(existsSync(join(ROOT, USER_TEST)), "test/cart.test.js is missing");
  assert.ok(userTestsPass(SOURCE), "your tests fail on the real src/cart.js");
});

test("hidden: your tests catch every broken cart", () => {
  assert.ok(existsSync(join(ROOT, USER_TEST)), "test/cart.test.js is missing");
  const survived = [];
  for (const [name, [from, to]] of Object.entries(MUTANTS)) {
    assert.ok(SOURCE.includes(from), `mutant setup failed: ${name}`);
    if (userTestsPass(SOURCE.replace(from, to))) survived.push(name);
  }
  assert.deepEqual(survived, [], `your tests did not catch: ${survived.join(", ")}`);
});
