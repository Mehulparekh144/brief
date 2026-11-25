"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const KINDS = [
  { id: "bug", label: "Bug", hint: "What did you do? What happened? What did you expect?" },
  { id: "feature", label: "Feature request", hint: "What do you want to do, and why does it matter to you?" },
  { id: "confusing", label: "Confusing", hint: "What was unclear? What did you think it meant?" },
  { id: "other", label: "Other", hint: "Tell us anything." },
] as const;

type Kind = (typeof KINDS)[number]["id"];
const NONE = "none"; // Radix Select cannot use "" as a value

/** "Report" button: a form for bugs, feature requests and confusion, linked to a session. */
export function ReportButton({ inline = false }: { inline?: boolean }) {
  const page = usePathname();
  const current = page.match(/^\/s\/([0-9a-f-]{36})/)?.[1] ?? "";
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("bug");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [sessionId, setSessionId] = useState(current || NONE);
  const [sessions, setSessions] = useState<{ id: string; label: string }[]>([]);
  const [sent, setSent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setSessionId(current || NONE), [current]);

  async function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) return;
    setSent(null);
    setError(null);
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
        sessionId: sessionId === NONE ? null : sessionId,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size={inline ? "default" : "lg"} className={inline ? "" : "fb-fab"}>
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {sent ? (
          <>
            <DialogHeader>
              <DialogTitle>Report #{sent} sent</DialogTitle>
              <DialogDescription>Thanks. We read every report{sessionId !== NONE ? " and replay the linked session" : ""}.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <form className="grid gap-4" onSubmit={send}>
            <DialogHeader>
              <DialogTitle>Send a report</DialogTitle>
              <DialogDescription>We also attach this page, your browser and your screen size.</DialogDescription>
            </DialogHeader>
            <fieldset className="kinds">
              <legend className="label">Type</legend>
              {KINDS.map((k) => (
                <label key={k.id} className={`kind ${kind === k.id ? "on" : ""}`}>
                  <input type="radio" name="kind" value={k.id} checked={kind === k.id} onChange={() => setKind(k.id)} />
                  {k.label}
                </label>
              ))}
            </fieldset>
            <div className="grid gap-2">
              <Label htmlFor="r-title">Title</Label>
              <Input id="r-title" required maxLength={140} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="One line, for example: Stop button did nothing" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="r-details">Details</Label>
              <Textarea id="r-details" rows={6} maxLength={8000} value={details} onChange={(e) => setDetails(e.target.value)} placeholder={hint} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="r-session">Session (helps us replay the problem)</Label>
              <Select value={sessionId} onValueChange={setSessionId}>
                <SelectTrigger id="r-session" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>No session</SelectItem>
                  {current && !sessions.some((s) => s.id === current) && <SelectItem value={current}>This session</SelectItem>}
                  {sessions.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.id === current ? `This session · ${s.label}` : s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="error">{error}</p>}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={busy || !title.trim()}>
                {busy ? "Sending…" : "Send report"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
