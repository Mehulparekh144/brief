import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { toCSV } from "../src/export/csv.js";
import { ORDERS } from "../src/data.js";
import { buildReport } from "../src/report.js";

const ORIGINAL = {
    "README.md": "41a7219495b1a924e4aeee67b968650b1ccf2ec92bde3abd1edccec2931a9b67",
    "package.json": "40f35ab264efdbe75e2ccc24998e9d99bc5b68bb753cc2a095429fe31bb574e2",
    "src/data.js": "15b1f62e88076bb682ad8e8fa5873c6d2603713fe7fd52bbabf00afd95f02c6e",
    "src/format.js": "8d5034b0308c63123836751a19c327df91119ac72e81ee612650449558a957c7",
    "src/index.js": "036f4dfbeeb7140c60e4b355127ff47a1a383fcc89d8cd37bb823866ffbf9be4",
    "src/report.js": "ff0fe1350192604cc8c68b73890d4c07d940d8f9c13e924ff1a76a25fdf4a348",
    "test/report.test.js": "b53095bbe8dd7d2489fb4eafba55d161d1f90715fab97d556e2322d9a81da8d6",
    
};

test("hidden: header plus one line per row", () => {
  assert.equal(toCSV([{ a: 1, b: "x" }, { a: 2, b: "y" }], ["a", "b"]), "a,b\n1,x\n2,y");
});
test("hidden: quotes, commas and newlines are escaped", () => {
  assert.equal(toCSV([{ n: 'Linus "Penguin" T.', c: "a,b", m: "two\nlines" }], ["n", "c", "m"]), 'n,c,m\n"Linus ""Penguin"" T.","a,b","two\nlines"');
});
test("hidden: missing values are empty and column order is kept", () => {
  assert.equal(toCSV([{ b: 2 }], ["a", "b"]), "a,b\n,2");
});
test("hidden: no rows gives just the header", () => {
  assert.equal(toCSV([], ["id", "total"]), "id,total");
});
test("hidden: works on the real report", () => {
  const csv = toCSV(buildReport(ORDERS), ["id", "customer", "total", "status"]);
  assert.equal(csv.split("\n")[3], '1003,"Linus ""Penguin"" T.",41.00,paid');
});
test("hidden: existing files are unchanged", () => {
  for (const [file, hash] of Object.entries(ORIGINAL)) {
    const now = createHash("sha256").update(readFileSync(new URL("../" + file, import.meta.url))).digest("hex");
    assert.equal(now, hash, file + " was changed");
  }
});
