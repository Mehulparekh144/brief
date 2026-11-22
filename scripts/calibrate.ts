// Applies the 2x rule and writes par.json.
// Runs the good brief and the lazy brief 3 times each, then grades with hidden tests.
// Usage: npm run calibrate -- [challenge-slug ...]   (no slug = every challenge)
import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync } from "node:fs";
import { HARNESS_VERSION, MODEL, Session } from "../src/agent.ts";
import { type Challenge, listChallenges, loadChallenge, parPath } from "../src/challenge.ts";
import { cost, fmt, median, total } from "../src/meter.ts";
import { openWorkspace, runTests } from "../src/sandbox.ts";

const RUNS = 3;
const client = new Anthropic();

type Run = { tokens: number; passed: boolean; cost: number; note: string };

async function runBrief(ch: Challenge, messages: string[]): Promise<Run> {
  const sbx = await openWorkspace(ch);
  try {
    const s = new Session(client, sbx, ch);
    for (const m of messages) {
      if (s.stopped) break;
      await s.send(m);
    }
    const r = await runTests(sbx, ch, true);
    return { tokens: total(s.tally), passed: r.ok, cost: cost(s.tally), note: `${r.passed}/${r.total} tests${s.stopped ? `, ${s.stopped}` : ""}` };
  } catch (e) {
    return { tokens: 0, passed: false, cost: 0, note: `error: ${(e as Error).message}` };
  } finally {
    await sbx.kill();
  }
}

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : listChallenges({ drafts: true });
let allPass = true;

for (const slug of slugs) {
  const ch = loadChallenge(slug);
  console.log(`\n${ch.title} (${slug}) · ${MODEL} · ${RUNS} good + ${RUNS} lazy runs…`);
  // 6 sandboxes at once: stays under the E2B Hobby limit of 10.
  const runs = await Promise.all([
    ...Array.from({ length: RUNS }, () => runBrief(ch, ch.briefs.good)),
    ...Array.from({ length: RUNS }, () => runBrief(ch, ch.briefs.lazy)),
  ]);
  const good = runs.slice(0, RUNS);
  const lazy = runs.slice(RUNS);
  for (const [label, list] of [["good", good], ["lazy", lazy]] as const) {
    for (const r of list) console.log(`  ${label}  ${r.passed ? "pass" : "FAIL"}  ${fmt(r.tokens).padStart(9)} tok  $${r.cost.toFixed(4)}  ${r.note}`);
  }

  const goodPassing = good.filter((r) => r.passed).map((r) => r.tokens);
  const lazyFails = lazy.filter((r) => !r.passed).length;
  const lazyMedian = median(lazy.map((r) => r.tokens));
  if (goodPassing.length < 2) {
    allPass = false;
    console.log(`  ✗ Rule failed: the good brief passed only ${goodPassing.length} of ${RUNS} runs. No par written.`);
    continue;
  }
  const par = { median: median(goodPassing), low: Math.min(...goodPassing), high: Math.max(...goodPassing), runs: goodPassing };
  const ratio = lazyMedian / par.median;
  const ok = ratio >= 2 || lazyFails >= 2;
  allPass &&= ok;
  writeFileSync(
    parPath(slug),
    `${JSON.stringify({ ...par, model: MODEL, harnessVersion: HARNESS_VERSION, lazyMedian, lazyFails, ruleOk: ok, date: new Date().toISOString().slice(0, 10) }, null, 2)}\n`,
  );
  console.log(`  par ${fmt(par.median)} (${fmt(par.low)}–${fmt(par.high)}) · lazy median ${fmt(lazyMedian)} = ${ratio.toFixed(1)}× par · lazy fails ${lazyFails}/${RUNS}`);
  console.log(ok ? "  ✓ 2× rule passed. par.json written." : "  ✗ 2× rule failed: lazy briefs are too cheap. Make the challenge harder to guess. par.json written for reference.");
}
process.exit(allPass ? 0 : 1);
