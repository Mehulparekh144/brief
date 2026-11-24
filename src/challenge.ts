import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const CATEGORIES = {
  "bug-fix": "Bug fixing",
  spec: "Build from a spec",
  refactor: "Refactor and scope",
  testing: "Testing",
  security: "Security",
} as const;
export type Category = keyof typeof CATEGORIES;

export type Par = { median: number; low: number; high: number; runs: number[] };

export type Challenge = {
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: Category;
  skill: string;
  statement: string;
  /** Runs in the repo root. Exit code 0 means every test passed. */
  testCmd: string;
  tokenCap: number;
  /** Repo path -> file content. */
  repo: Record<string, string>;
  /** Copied into the repo only at Submit. Same layout as repo. */
  hidden: Record<string, string>;
  briefs: { good: string[]; lazy: string[] };
  par?: Par;
  /** Failed the 2× rule or not finished: hidden from the site. */
  draft?: boolean;
  /** A pass needs at least this many passing tests (public + hidden), so a broken runner cannot fake one. */
  minTests: number;
  /** Repo paths (files, or folders ending in /) restored to the original before grading. */
  protected: string[];
};

// Run from the project root (npm scripts and next both do). A URL import here would make the bundler pull the folder in.
const ROOT = join(process.cwd(), "challenges");

function readTree(dir: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!existsSync(dir)) return out;
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else out[relative(dir, p)] = readFileSync(p, "utf8");
    }
  };
  walk(dir);
  return out;
}

/** Token cap for one session: 4 × par (at least 40k), or the challenge's flat cap before calibration. */
export const capFor = (ch: Challenge) => (ch.par ? Math.max(40_000, Math.round(4 * ch.par.median)) : ch.tokenCap);

export const parPath =(slug: string) => join(ROOT, slug, "par.json");

export const listChallenges = ({ drafts = false } = {}) =>
  readdirSync(ROOT)
    .filter((d) => existsSync(join(ROOT, d, "challenge.json")))
    .filter((d) => drafts || !JSON.parse(readFileSync(join(ROOT, d, "challenge.json"), "utf8")).draft)
    .sort();

// Parsed challenges are cached in production; dev reloads them so edits and new par.json show up.
const cache = new Map<string, Challenge>();

export function loadChallenge(slug: string): Challenge {
  const hit = cache.get(slug);
  if (hit) return hit;
  const dir = join(ROOT, slug);
  if (!existsSync(join(dir, "challenge.json"))) {
    throw new Error(`No challenge "${slug}". Choose one of: ${listChallenges().join(", ")}`);
  }
  const meta = JSON.parse(readFileSync(join(dir, "challenge.json"), "utf8"));
  const ch: Challenge = {
    slug,
    ...meta,
    statement: readFileSync(join(dir, "statement.md"), "utf8"),
    repo: readTree(join(dir, "repo")),
    hidden: readTree(join(dir, "hidden")),
    par: existsSync(parPath(slug)) ? JSON.parse(readFileSync(parPath(slug), "utf8")) : undefined,
  };
  if (process.env.NODE_ENV === "production") cache.set(slug, ch);
  return ch;
}

/** Reads pass/fail counts from node --test (TAP) or python unittest output. */
export function parseCounts(out: string): { passed: number; total: number } | null {
  // Last match: the runner's own summary comes last; earlier lines may be printed by the code under test.
  const last = (re: RegExp) => [...out.matchAll(re)].at(-1);
  const p = last(/^# pass (\d+)/gm);
  const f = last(/^# fail (\d+)/gm);
  if (p && f) return { passed: +p[1], total: +p[1] + +f[1] };
  const ran = last(/^Ran (\d+) tests?/gm);
  if (ran) {
    let bad = 0;
    const failed = last(/^FAILED \(([^)]*)\)/gm);
    if (failed) for (const m of failed[1].matchAll(/(?:failures|errors)=(\d+)/g)) bad += +m[1];
    return { passed: +ran[1] - bad, total: +ran[1] };
  }
  return null;
}
