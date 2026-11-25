"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

async function save(body: Record<string, unknown>) {
  const res = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.ok ? null : ((await res.json().catch(() => ({}))).error ?? "Could not save.");
}

/** 1–5 rating plus an optional comment, saved against a session. */
export function DebriefRating({ sessionId }: { sessionId: string }) {
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const err = await save({ sessionId, rating, text, page: "debrief" });
    setError(err);
    setSent(!err);
  }

  if (sent) return <p className="muted">Thanks. Your rating helps us improve the coach.</p>;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Was this debrief useful? 1 to 5">
        <span className="mr-1 text-sm">Was this debrief useful?</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <Button key={n} size="icon-sm" variant={rating === n ? "default" : "outline"} aria-pressed={rating === n} onClick={() => setRating(n)} className="font-num">
            {n}
          </Button>
        ))}
      </div>
      {rating !== null && (
        <>
          <Label htmlFor="db-text" className="text-muted-foreground">
            What would make it more useful? (optional)
          </Label>
          <Textarea id="db-text" rows={3} maxLength={4000} value={text} onChange={(e) => setText(e.target.value)} />
          {error && <p className="error">{error}</p>}
          <Button className="justify-self-start" onClick={send}>
            Send rating
          </Button>
        </>
      )}
    </div>
  );
}

/** Reloads the server page every few seconds (used while the coach writes). */
export function AutoRefresh({ seconds }: { seconds: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(t);
  }, [router, seconds]);
  return null;
}
