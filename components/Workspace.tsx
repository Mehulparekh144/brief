"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fmt, k, PAR_TEXT, parRange } from "@/lib/format.ts";
import type { Par } from "@/src/challenge.ts";
import { track } from "./Analytics.tsx";
import { DifficultyChip, ParHelp } from "./Bits.tsx";
import { Code } from "./Code.tsx";
import { Meter } from "./Meter.tsx";
import { ReportButton } from "./Report.tsx";

type Ev = { seq: number; kind: string; data: Record<string, unknown> };
type Item =
  | { type: "agent"; text: string; tokens: number }
  | { type: "tool"; text: string; tokens: number }
  | { type: "sys"; text: string; tone: "warn" | "bad" }
  | { type: "tests"; passed: number; total: number; ok: boolean; output: string };
type Group = { user: { text: string; tokens: number } | null; items: Item[] };
type Tab = { path: string; content: string; changed: boolean };

type Props = {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  skill: string;
  statement: string;
  par: Par | null;
  cap: number;
};

/** Folds the event log into what the screen shows. */
function fold(events: Ev[]) {
  const groups: Group[] = [{ user: null, items: [] }];
  let tokens = 0;
  let busy = false;
  let submitting = false;
  let submitted = false;
  let ended: string | null = null;
  const last = () => groups[groups.length - 1];
  for (const { kind, data } of events) {
    const text = String(data.text ?? "");
    if (kind === "user") groups.push({ user: { text, tokens: 0 }, items: [] });
    else if (kind === "text") last().items.push({ type: "agent", text, tokens: Number(data.tokens ?? 0) });
    else if (kind === "tool") last().items.push({ type: "tool", text, tokens: Number(data.tokens ?? 0) });
    else if (kind === "stop" || kind === "notice") last().items.push({ type: "sys", text, tone: "warn" });
    else if (kind === "error") last().items.push({ type: "sys", text, tone: "bad" });
    else if (kind === "tests") last().items.push({ type: "tests", passed: Number(data.passed), total: Number(data.total), ok: Boolean(data.ok), output: String(data.output ?? "") });
    else if (kind === "meter") {
      tokens = Number(data.tokens ?? 0);
      const u = last().user;
      if (u) u.tokens = Number(data.briefTokens ?? 0);
    } else if (kind === "busy") busy = Boolean(data.busy);
    else if (kind === "submitting") submitting = true;
    else if (kind === "submitted") submitted = true;
    else if (kind === "ended") ended = text;
  }
  return { groups, tokens, busy, submitting, submitted, ended };
}

/** Flat file paths -> rows with folder headers and indentation. */
function treeRows(files: string[]) {
  const rows: { key: string; name: string; depth: number; path?: string }[] = [];
  let prev: string[] = [];
  for (const f of files) {
    const parts = f.split("/");
    const dirs = parts.slice(0, -1);
    let same = 0;
    while (same < dirs.length && dirs[same] === prev[same]) same++;
    for (let d = same; d < dirs.length; d++) rows.push({ key: `dir:${dirs.slice(0, d + 1).join("/")}`, name: `${dirs[d]}/`, depth: d });
    rows.push({ key: f, name: parts[parts.length - 1], depth: dirs.length, path: f });
    prev = dirs;
  }
  return rows;
}

async function post(url: string, body?: unknown): Promise<string | null> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });
  if (res.ok) return null;
  return (await res.json().catch(() => ({}))).error ?? "Something went wrong.";
}

export function Workspace({ id, slug, title, difficulty, skill, statement, par, cap }: Props) {
  const router = useRouter();
  const [events, setEvents] = useState<Ev[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lost, setLost] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [testing, setTesting] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState<string>("task"); // "task" or a file path
  const chatRef = useRef<HTMLDivElement>(null);
  const base = `/api/sessions/${id}`;

  const { groups, tokens, busy, submitting, submitted, ended } = useMemo(() => fold(events), [events]);
  const locked = busy || submitting || submitted;
  const rows = useMemo(() => treeRows(files), [files]);

  useEffect(() => {
    const es = new EventSource(`${base}/stream`);
    es.onmessage = (m) => {
      const ev = JSON.parse(m.data) as Ev;
      setEvents((prev) => (prev.some((p) => p.seq === ev.seq) ? prev : [...prev, ev]));
    };
    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) setLost(true); // the server said the workspace is gone
    };
    return () => es.close();
  }, [base]);

  useEffect(() => {
    if (submitted) router.push(`/s/${id}/debrief`);
  }, [submitted, id, router]);

  const fetchFile = useCallback(
    async (path: string): Promise<string | null> => {
      const res = await fetch(`${base}/files?path=${encodeURIComponent(path)}`);
      return res.ok ? (await res.json()).content : null;
    },
    [base],
  );

  // When the agent goes idle, it may have changed files: refresh the tree and every open tab.
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;
  useEffect(() => {
    if (busy) return;
    void (async () => {
      const res = await fetch(`${base}/files`);
      if (res.ok) setFiles((await res.json()).files);
      const fresh = await Promise.all(tabsRef.current.map(async (t) => ({ ...t, next: await fetchFile(t.path) })));
      setTabs(fresh.map(({ next, ...t }) => (next === null || next === t.content ? t : { ...t, content: next, changed: true })));
    })();
  }, [busy, base, fetchFile]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [events.length]);

  async function openFile(path: string) {
    setActive(path);
    if (tabs.some((t) => t.path === path)) return setTabs((ts) => ts.map((t) => (t.path === path ? { ...t, changed: false } : t)));
    const content = await fetchFile(path);
    if (content !== null) setTabs((ts) => (ts.some((t) => t.path === path) ? ts : [...ts, { path, content, changed: false }]));
  }

  function closeTab(path: string) {
    const i = tabs.findIndex((t) => t.path === path);
    const rest = tabs.filter((t) => t.path !== path);
    setTabs(rest);
    if (active === path) setActive(rest[Math.max(0, i - 1)]?.path ?? "task");
  }

  async function send() {
    if (!draft.trim() || locked) return;
    setError(null);
    const err = await post(`${base}/messages`, { text: draft });
    if (err) return setError(err);
    track("message_sent", { challenge: slug, length: draft.length });
    setDraft("");
  }

  async function runTests() {
    setTesting(true);
    setError(await post(`${base}/tests`));
    setTesting(false);
    track("public_tests_run", { challenge: slug });
  }

  async function submit() {
    if (!confirmSubmit) return setConfirmSubmit(true);
    setError(await post(`${base}/submit`));
    track("submitted", { challenge: slug, tokens });
  }

  if ((lost || ended) && !submitted) {
    return (
      <main className="page narrow">
        <p className="notice bad">{ended ?? "The workspace stopped. This attempt does not count."}</p>
        <Link className="btn primary" href="/challenges" style={{ justifySelf: "start" }}>
          Back to practice
        </Link>
      </main>
    );
  }

  const tab = tabs.find((t) => t.path === active);
  return (
    <div className="ws">
      <div className="ws-top">
        <Link href="/challenges" className="wm">
          <b>brief</b>lab
        </Link>
        <div className="ws-title">
          <strong>{title}</strong>
          <DifficultyChip level={difficulty} />
        </div>
        <div style={{ justifySelf: "center", width: "100%", maxWidth: 440, display: "grid", gap: 2 }}>
          <Meter tokens={tokens} par={par} cap={cap} />
          <div style={{ justifySelf: "end" }}>
            <ParHelp />
          </div>
        </div>
        <div className="ws-actions">
          <ReportButton inline />
          <button className="btn" onClick={runTests} disabled={locked || testing} title="Runs the public tests. Costs 0 tokens.">
            {testing ? "Testing…" : "Run tests"}
          </button>
          <button className="btn" onClick={() => post(`${base}/stop`)} disabled={!busy}>
            Stop
          </button>
          <button className="btn primary" onClick={submit} disabled={busy || submitting || submitted} onBlur={() => setConfirmSubmit(false)}>
            {submitting ? "Grading…" : confirmSubmit ? "Confirm: run hidden tests" : "Submit"}
          </button>
        </div>
      </div>

      <div className="ws-body">
        <nav className="ws-files" aria-label="Files">
          <p className="files-head">
            <span className="label">Files</span>
            <span>reading is free</span>
          </p>
          <ul className="tree">
            <li>
              <button onClick={() => setActive("task")} aria-current={active === "task"} className="task-link">
                Task
              </button>
            </li>
            {rows.map((r) =>
              r.path ? (
                <li key={r.key}>
                  <button onClick={() => openFile(r.path!)} aria-current={active === r.path} style={{ paddingLeft: 8 + r.depth * 14 }}>
                    {r.name}
                  </button>
                </li>
              ) : (
                <li key={r.key} className="dir" style={{ paddingLeft: 8 + r.depth * 14 }}>
                  {r.name}
                </li>
              ),
            )}
          </ul>
        </nav>

        <section className="editor" aria-label="Editor">
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={active === "task"} className="tab" onClick={() => setActive("task")}>
              Task
            </button>
            {tabs.map((t) => (
              <span key={t.path} className={`tab ${active === t.path ? "on" : ""}`}>
                <button role="tab" aria-selected={active === t.path} onClick={() => openFile(t.path)} title={t.path}>
                  {t.path.split("/").pop()}
                  {t.changed && <span className="dot" title="Changed by the agent" />}
                </button>
                <button className="x" aria-label={`Close ${t.path}`} onClick={() => closeTab(t.path)}>
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="editor-body">
            {active === "task" || !tab ? (
              <article className="task">
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: 22 }}>{title}</h1>
                  <DifficultyChip level={difficulty} />
                </div>
                <p className="label">Skill: {skill}</p>
                <p className="statement">{statement.trim()}</p>
                <div className="notice par-explainer">
                  <b>Par {parRange(par)}</b>
                  <span>{PAR_TEXT}</span>
                </div>
                <p className="muted" style={{ fontSize: 13 }}>
                  The agent cannot see this page or your open files. It knows only what you write. Open files on the left: reading costs 0 tokens.
                </p>
              </article>
            ) : (
              <>
                <div className="editor-path">
                  <span>{tab.path}</span>
                  <span className="muted">read only · 0 tokens</span>
                </div>
                <Code path={tab.path} content={tab.content} />
              </>
            )}
          </div>
        </section>

        <section className="agent" aria-label="Agent">
          <div className="chat" ref={chatRef} aria-live="polite">
            {groups.length === 1 && !groups[0].items.length && (
              <p className="muted">Tell the agent what to do. Fewer, clearer messages use fewer tokens.</p>
            )}
            {groups.map((g, gi) => (
              <div key={gi} style={{ display: "grid", gap: 8 }}>
                {g.user && (
                  <div className="msg">
                    <div className="msg-head">
                      <span className="who">You · {gi}</span>
                      <span className="cost">{fmt(g.user.tokens)} tok</span>
                    </div>
                    <p>{g.user.text}</p>
                  </div>
                )}
                {g.items.length > 0 && (
                  <div className={g.user ? "steps" : ""}>
                    {g.items.map((it, i) =>
                      it.type === "tool" ? (
                        <div key={i} className="step">
                          <span>{it.text}</span>
                          <span className="tok">{it.tokens ? k(it.tokens) : ""}</span>
                        </div>
                      ) : it.type === "agent" ? (
                        <div key={i} className="agent-say">
                          {it.text}
                          {it.tokens ? <span className="tok num muted"> · {k(it.tokens)}</span> : null}
                        </div>
                      ) : it.type === "sys" ? (
                        <div key={i} className="sys" style={it.tone === "bad" ? { color: "var(--bad)" } : undefined}>
                          {it.text}
                        </div>
                      ) : (
                        <div key={i} style={{ display: "grid", gap: 6 }}>
                          <span className={`pill ${it.ok ? "good" : "warn"}`} style={{ justifySelf: "start" }}>
                            Public tests: {it.passed}/{it.total} passed · 0 tokens
                          </span>
                          <details>
                            <summary className="muted" style={{ fontSize: 12 }}>
                              Test output
                            </summary>
                            <pre className="tests-out">{it.output}</pre>
                          </details>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
            {busy && <div className="working">Agent is working…</div>}
            {submitting && <div className="working">Running hidden tests…</div>}
          </div>

          <div className="composer">
            {error && <p className="error">{error}</p>}
            <label htmlFor="brief" className="sr-only">
              Message to the agent
            </label>
            <textarea
              id="brief"
              value={draft}
              maxLength={2000}
              placeholder={busy ? "The agent is working. Press Esc or Stop to interrupt." : "Message the agent…"}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  void send();
                } else if (e.key === "Escape" && busy) void post(`${base}/stop`);
              }}
            />
            <div className="composer-row">
              <span className="hint">⌘↵ send · Esc stop · {fmt(draft.length)} / 2,000</span>
              <button className="btn primary" onClick={send} disabled={locked || !draft.trim()}>
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
