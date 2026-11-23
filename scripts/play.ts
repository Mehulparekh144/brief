// Play one challenge in the terminal: you brief the agent, the meter counts tokens.
// Usage: npm run play -- <challenge-slug>
import Anthropic from "@anthropic-ai/sdk";
import { createInterface } from "node:readline/promises";
import { type Brief, MODEL, Session } from "../src/agent.ts";
import { capFor, listChallenges, loadChallenge, type Par } from "../src/challenge.ts";
import { cost, fmt, k, total } from "../src/meter.ts";
import { diffOf, openWorkspace, runTests } from "../src/sandbox.ts";

const slug = process.argv[2];
if (!slug) {
  console.log(`Usage: npm run play -- <challenge>\nChallenges: ${listChallenges().join(", ")}`);
  process.exit(1);
}
const ch = loadChallenge(slug);
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

function vsPar(tokens: number, par?: Par): string {
  if (!par) return "no par yet (run calibrate)";
  const pct = Math.round((tokens / par.median - 1) * 100);
  return `par ${k(par.low)}–${k(par.high)} · ${pct > 0 ? `+${pct}% over` : `${pct}% under`} par`;
}

function meter(s: Session) {
  const t = total(s.tally);
  console.log(bold(`\n── ${fmt(t)} tokens · ${vsPar(t, ch.par)} · cap ${fmt(capFor(ch))} · $${cost(s.tally).toFixed(4)} · ${s.tally.calls} calls`));
}

function debrief(briefs: Brief[], s: Session, tests: { ok: boolean; passed: number; total: number }) {
  const t = total(s.tally);
  console.log(bold(`\n=== Debrief · ${ch.title} ===`));
  console.log(`Hidden tests: ${tests.ok ? "PASSED" : "FAILED"} (${tests.passed}/${tests.total})`);
  console.log(`Tokens: ${fmt(t)} · ${vsPar(t, ch.par)} · $${cost(s.tally).toFixed(4)}`);
  console.log(`Breakdown: input ${fmt(s.tally.input)} · cache write ${fmt(s.tally.cacheWrite)} · cache read ${fmt(s.tally.cacheRead)} · output ${fmt(s.tally.output)}`);
  console.log("\nYour messages:");
  briefs.forEach((b, i) => {
    const share = t ? Math.round((b.tokens / t) * 100) : 0;
    console.log(`  ${i + 1}. ${fmt(b.tokens).padStart(8)} tok (${share}%) · ${b.calls} calls · ${b.text.slice(0, 70)}`);
  });
}

console.log(bold(`\n${ch.title}`) + dim(`  · skill: ${ch.skill} · model: ${MODEL}`));
console.log(`\n${ch.statement.trim()}\n`);
console.log(dim(`Par: ${ch.par ? `${k(ch.par.low)}–${k(ch.par.high)} tokens` : "not set yet"} · Cap: ${fmt(capFor(ch))} tokens`));
console.log(dim("Setting up your workspace…"));

const sbx = await openWorkspace(ch);
const session = new Session(new Anthropic(), sbx, ch, (step) => {
  const tok = "tokens" in step && step.tokens ? dim(`  ${k(step.tokens)}`) : "";
  if (step.kind === "tool") console.log(dim(`  · ${step.text}`) + tok);
  else if (step.kind === "text") console.log(`  agent: ${step.text}${tok}`);
  else console.log(bold(`  ! ${step.text}`));
});
const rl = createInterface({ input: process.stdin, output: process.stdout });
console.log("Ready. Type a message for the agent. Commands: /files /tests (free) · /submit · /quit");

/** Handles one input line. Returns "done" to end the session. */
async function handle(line: string): Promise<"done" | void> {
  if (!line) return;
  if (line === "/quit") return "done";
  if (line === "/files") return void console.log(Object.keys(ch.repo).sort().join("\n"));
  if (line === "/tests") {
    const r = await runTests(sbx, ch, false);
    console.log(dim(r.output.slice(-3000)));
    return void console.log(bold(`Public tests: ${r.passed}/${r.total} passed (0 tokens)`));
  }
  if (line === "/submit") {
    const diff = await diffOf(sbx);
    const r = await runTests(sbx, ch, true);
    console.log(dim(`\nYour changes:\n${diff.slice(0, 4000)}`));
    debrief(session.briefs, session, r);
    return "done";
  }
  if (line.length > 2000) return void console.log("Messages are limited to 2,000 characters.");
  if (session.stopped) return void console.log(`The agent stopped: ${session.stopped}. Use /submit.`);
  try {
    await session.send(line);
  } catch (e) {
    if (e instanceof Anthropic.APIError) console.log(`API error ${e.status}: ${e.message}`);
    else throw e;
  }
  meter(session);
}

try {
  let inputClosed = false;
  rl.on("close", () => (inputClosed = true));
  rl.setPrompt("\nyou › ");
  rl.prompt();
  // Reading lines as a stream also works with piped input (lines are queued while the agent runs).
  for await (const raw of rl) {
    if ((await handle(raw.trim())) === "done") break;
    if (!inputClosed) rl.prompt();
  }
} finally {
  rl.close();
  await sbx.kill();
}
