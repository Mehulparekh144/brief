import type Anthropic from "@anthropic-ai/sdk";
import type { Sandbox } from "e2b";
import { type Challenge, capFor } from "./challenge.ts";
import { add, callTotal, emptyTally, promptSize, total } from "./meter.ts";
import { REPO } from "./sandbox.ts";
import { describe, runTool, TOOLS } from "./tools.ts";

// Fixed for every user. Changing any of these needs a new par for every challenge.
export const MODEL = "claude-haiku-5-5";
export const HARNESS_VERSION = 1;
const EFFORT = "low";
const MAX_CALLS_PER_MESSAGE = 25;
const CONTEXT_CAP = 90_000; // Haiku 5.5 costs 5x more per token above 100k input
// Keep these bytes stable: the system prompt is part of the cached prefix.
const SYSTEM = `You are a coding agent. The repository is at ${REPO}. Work only inside it. The machine has no internet access.
Use the bash tool to run commands and the text editor tool to read and change files.
Do what the user asks. When you finish, reply with a short summary of what you changed.`;

export type Step =
  | { kind: "text"; text: string; tokens: number }
  | { kind: "tool"; text: string; tokens: number }
  | { kind: "stop"; text: string };

/** One user message and the tokens it caused, up to the next user message. */
export type Brief = { text: string; tokens: number; calls: number };

export class Session {
  readonly messages: Anthropic.MessageParam[] = [];
  readonly tally = emptyTally();
  readonly briefs: Brief[] = [];
  /** Why the agent can no longer run, or null. */
  stopped: string | null = null;
  private stopRequested = false;

  /** Stops the agent before its next model call. The session stays usable. */
  requestStop() {
    this.stopRequested = true;
  }

  private readonly client: Anthropic;
  readonly sbx: Sandbox;
  readonly ch: Challenge;
  private readonly onStep: (s: Step) => void;

  constructor(client: Anthropic, sbx: Sandbox, ch: Challenge, onStep: (s: Step) => void = () => {}) {
    this.client = client;
    this.sbx = sbx;
    this.ch = ch;
    this.onStep = onStep;
  }

  /** Sends one user message and runs the agent until it stops, asks something, or hits a cap. */
  async send(text: string): Promise<void> {
    if (this.stopped) throw new Error(`The agent stopped: ${this.stopped}.`);
    const brief: Brief = { text, tokens: 0, calls: 0 };
    this.briefs.push(brief);
    this.pushUser([{ type: "text", text }]);

    this.stopRequested = false;
    for (let i = 0; i < MAX_CALLS_PER_MESSAGE; i++) {
      if (this.stopRequested) return this.onStep({ kind: "stop", text: "Stopped by you." });
      if (total(this.tally) >= capFor(this.ch)) return this.stop("token cap reached");

      const res = await this.client.messages.create({
        model: MODEL,
        max_tokens: 16000,
        system: SYSTEM,
        tools: [...TOOLS],
        messages: this.messages,
        cache_control: { type: "ephemeral" },
        output_config: { effort: EFFORT },
      });
      add(this.tally, res.usage);
      const tokens = callTotal(res.usage);
      brief.tokens += tokens;
      brief.calls += 1;
      this.messages.push({ role: "assistant", content: res.content }); // append-only, unchanged

      let shown = false; // show this call's tokens once, on its first step
      const tag = () => (shown ? 0 : ((shown = true), tokens));
      for (const b of res.content) if (b.type === "text" && b.text.trim()) this.onStep({ kind: "text", text: b.text.trim(), tokens: tag() });

      const calls = res.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const b of calls) {
        const input = b.input as Record<string, unknown>;
        if (res.stop_reason !== "tool_use") {
          // Cut-off or refused turn: answer the call so the history stays valid, but do not run it.
          results.push({ type: "tool_result", tool_use_id: b.id, content: "Not run: the reply was cut off.", is_error: true });
          continue;
        }
        this.onStep({ kind: "tool", text: describe(b.name, input), tokens: tag() });
        const r = await runTool(this.sbx, b.name, input);
        results.push({ type: "tool_result", tool_use_id: b.id, content: r.content, is_error: r.isError });
      }
      if (results.length) this.messages.push({ role: "user", content: results });

      if (res.stop_reason === "refusal") return this.stop("the model refused");
      if (promptSize(res.usage) > CONTEXT_CAP) return this.stop("the conversation is too long for the agent");
      if (res.stop_reason !== "tool_use") return; // end_turn or max_tokens: the agent's turn is over
    }
    this.onStep({ kind: "stop", text: `The agent used ${MAX_CALLS_PER_MESSAGE} steps. Send a message to continue.` });
  }

  /** Keeps user/assistant turns alternating: a new message joins pending tool results. */
  private pushUser(content: Anthropic.ContentBlockParam[]) {
    const last = this.messages.at(-1);
    if (last?.role === "user" && Array.isArray(last.content)) last.content.push(...content);
    else this.messages.push({ role: "user", content });
  }

  private stop(reason: string) {
    this.stopped = reason;
    this.onStep({ kind: "stop", text: `Agent stopped: ${reason}.` });
  }
}
