"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const KINDS = [
  { id: "bug", label: "Bug", hint: "What did you do? What happened? What did you expect?" },
  { id: "feature", label: "Feature request", hint: "What do you want to do, and why does it matter to you?" },
  { id: "confusing", label: "Confusing", hint: "What was unclear? What did you think it meant?" },
  { id: "other", label: "Other", hint: "Tell us anything." },
] as const;

type Kind = (typeof KINDS)[number]["id"];

/** "Report" button: a form for bugs, feature requests and confusion, linked to a session. */
export function ReportButton({ inline = false }: { inline?: boolean }) {
  const page = usePathname();
  const current = page.match(/^\/s\/([0-9a-f-]{36})/)?.[1] ?? "";
  const dialog = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<Kind>("bug");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [sessionId, setSessionId] = useState(current);
  const [sessions, setSessions] = useState<{ id: string; label: string }[]>([]);
  const [sent, setSent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setSessionId(current), [current]);

  async function open() {
    setSent(null);
    setError(null);
    dialog.current?.showModal();
    const res = await fetch("/api/reports");
    if (res.ok) setSessions((await res.json()).sessions);
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        title,
        details,
        sessionId,
        context: { page: location.pathname, viewport: `${innerWidth}x${innerHeight}`, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(body.error ?? "Could not send.");
    setSent(body.id);
    setTitle("");
    setDetails("");
  }

  const hint = KINDS.find((k) => k.id === kind)!.hint;
  return (
    <>
      <button className={`btn ${inline ? "" : "fb-fab"}`} onClick={open}>
        Report
      </button>
      <dialog ref={dialog} className="report" aria-labelledby="report-title">
        {sent ? (
          <div className="report-body">
            <h2 id="report-title">Report #{sent} sent</h2>
            <p className="muted">Thanks. We read every report{sessionId ? " and replay the linked session" : ""}.</p>
            <button className="btn primary" onClick={() => dialog.current?.close()} style={{ justifySelf: "start" }}>
              Close
            </button>
          </div>
        ) : (
          <form className="report-body" onSubmit={send}>
            <h2 id="report-title">Send a report</h2>
            <fieldset className="kinds">
              <legend className="label">Type</legend>
              {KINDS.map((k) => (
                <label key={k.id} className={`kind ${kind === k.id ? "on" : ""}`}>
                  <input type="radio" name="kind" value={k.id} checked={kind === k.id} onChange={() => setKind(k.id)} />
                  {k.label}
                </label>
              ))}
            </fieldset>
            <label htmlFor="r-title" className="label">
              Title
            </label>
            <input id="r-title" type="text" required maxLength={140} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="One line, for example: Stop button did nothing" />
            <label htmlFor="r-details" className="label">
              Details
            </label>
            <textarea id="r-details" rows={6} maxLength={8000} value={details} onChange={(e) => setDetails(e.target.value)} placeholder={hint} />
            <label htmlFor="r-session" className="label">
              Session (helps us replay the problem)
            </label>
            <select id="r-session" value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
              <option value="">No session</option>
              {current && !sessions.some((s) => s.id === current) && <option value={current}>This session</option>}
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id === current ? `This session · ${s.label}` : s.label}
                </option>
              ))}
            </select>
            <p className="muted" style={{ fontSize: 12 }}>
              We also attach this page, your browser and your screen size.
            </p>
            {error && <p className="error">{error}</p>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" className="btn" onClick={() => dialog.current?.close()}>
                Cancel
              </button>
              <button className="btn primary" disabled={busy || !title.trim()}>
                {busy ? "Sending…" : "Send report"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
