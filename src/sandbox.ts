import { CommandExitError, Sandbox } from "e2b";
import { type Challenge, parseCounts } from "./challenge.ts";

export const REPO = "/home/user/repo";

export type TestResult = { ok: boolean; passed: number; total: number; output: string };

/** Single-quote a string for bash. */
export const q = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`;

/** Runs a shell command in the repo. Never throws: returns combined output and exit code. */
export async function sh(sbx: Sandbox, cmd: string, timeoutMs = 60_000): Promise<{ out: string; code: number }> {
  try {
    const r = await sbx.commands.run(cmd, { cwd: REPO, timeoutMs });
    return { out: r.stdout + r.stderr, code: r.exitCode };
  } catch (e) {
    if (e instanceof CommandExitError) return { out: e.stdout + e.stderr, code: e.exitCode };
    return { out: `Command failed: ${(e as Error).message}`, code: -1 };
  }
}

const write = (sbx: Sandbox, files: Record<string, string>) =>
  sbx.files.write(Object.entries(files).map(([path, data]) => ({ path: `${REPO}/${path}`, data })));

/** New sandbox with the challenge repo and a git baseline. No internet, no keys inside. */
export async function openWorkspace(ch: Challenge): Promise<Sandbox> {
  const sbx = await Sandbox.create({ timeoutMs: 35 * 60_000, allowInternetAccess: false });
  await write(sbx, ch.repo);
  await sh(sbx, "git init -q && git add -A && git -c user.email=lab@brieflab.dev -c user.name=brieflab commit -qm start");
  return sbx;
}

/** Changes the agent made, as a git diff against the starting state. */
export async function diffOf(sbx: Sandbox): Promise<string> {
  return (await sh(sbx, "git add -A && git diff --cached --stat && git diff --cached")).out;
}

/** Public tests only, or public + hidden (at Submit). Costs 0 tokens. */
export async function runTests(sbx: Sandbox, ch: Challenge, withHidden: boolean): Promise<TestResult> {
  if (withHidden) await write(sbx, ch.hidden);
  const r = await sh(sbx, ch.testCmd, 120_000);
  const counts = parseCounts(r.out) ?? { passed: 0, total: 0 };
  return { ok: r.code === 0, ...counts, output: r.out };
}
