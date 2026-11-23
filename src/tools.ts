import { posix } from "node:path";
import type { Sandbox } from "e2b";
import { q, REPO, sh } from "./sandbox.ts";

export const TOOLS = [
  { type: "bash_20250124", name: "bash" },
  { type: "text_editor_20250728", name: "str_replace_based_edit_tool" },
] as const;

const MAX_OUT = 10_000;

/** Keeps the start and the end of long output. */
export function clip(s: string): string {
  if (s.length <= MAX_OUT) return s;
  const half = MAX_OUT / 2;
  return `${s.slice(0, half)}\n…[${s.length - MAX_OUT} characters cut]…\n${s.slice(-half)}`;
}

/** Model-supplied paths stay inside the repo. */
function resolve(p: unknown): string {
  if (typeof p !== "string" || !p) throw new Error("Missing path.");
  const abs = posix.resolve(REPO, p);
  if (abs !== REPO && !abs.startsWith(`${REPO}/`)) throw new Error(`Path must be inside ${REPO}.`);
  return abs;
}

type In = Record<string, unknown>;
export type ToolResult = { content: string; isError: boolean };

async function editor(sbx: Sandbox, input: In): Promise<string> {
  const path = resolve(input.path);
  switch (input.command) {
    case "view": {
      const dir = await sh(sbx, `test -d ${q(path)} && find ${q(path)} -maxdepth 2 -not -path '*/.git*' | sort`);
      if (dir.code === 0) return dir.out;
      const lines = (await sbx.files.read(path)).split("\n");
      const [start, end] = Array.isArray(input.view_range) ? (input.view_range as number[]) : [1, -1];
      const last = end === -1 ? lines.length : end;
      return lines
        .slice(start - 1, last)
        .map((l, i) => `${start + i}\t${l}`)
        .join("\n");
    }
    case "create":
      await sbx.files.write(path, String(input.file_text ?? ""));
      return `Created ${path}.`;
    case "str_replace": {
      const text = await sbx.files.read(path);
      const old = String(input.old_str ?? "");
      const count = old ? text.split(old).length - 1 : 0;
      if (count === 0) throw new Error(`No match for old_str in ${path}.`);
      if (count > 1) throw new Error(`Found ${count} matches for old_str in ${path}. Add more context.`);
      await sbx.files.write(path, text.replace(old, () => String(input.new_str ?? "")));
      return `Edited ${path}.`;
    }
    case "insert": {
      const lines = (await sbx.files.read(path)).split("\n");
      lines.splice(Number(input.insert_line ?? 0), 0, String(input.insert_text ?? ""));
      await sbx.files.write(path, lines.join("\n"));
      return `Inserted text in ${path}.`;
    }
    default:
      throw new Error(`Unknown command: ${String(input.command)}`);
  }
}

/** Runs one tool call inside the sandbox. */
export async function runTool(sbx: Sandbox, name: string, input: In): Promise<ToolResult> {
  try {
    if (name === "bash") {
      if (input.restart) return { content: "Shell restarted.", isError: false };
      const r = await sh(sbx, String(input.command ?? ""));
      return { content: clip(r.out) + (r.code === 0 ? "" : `\n[exit code ${r.code}]`), isError: false };
    }
    if (name === "str_replace_based_edit_tool") return { content: clip(await editor(sbx, input)), isError: false };
    return { content: `Unknown tool: ${name}`, isError: true };
  } catch (e) {
    return { content: (e as Error).message, isError: true };
  }
}

/** One short line for the transcript. */
export function describe(name: string, input: In): string {
  if (name === "bash") return `bash  ${String(input.command ?? "restart").split("\n")[0].slice(0, 90)}`;
  return `${String(input.command)}  ${String(input.path ?? "").replace(`${REPO}/`, "")}`;
}
