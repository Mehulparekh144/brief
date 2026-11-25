"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { track } from "./Analytics.tsx";

/** Starts (or resumes) a challenge through the API, then opens the workspace. */
export function StartButton({ slug, label }: { slug: string; label: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setPending(true);
    setError(null);
    track(label === "Start" ? "challenge_started" : "challenge_retried", { challenge: slug });
    const res = await fetch("/api/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challenge: slug }) });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.id) return router.push(`/s/${body.id}`);
    setError(body.error ?? "Could not start the session. Try again.");
    setPending(false);
  }

  return (
    <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
      <Button disabled={pending} onClick={start}>
        {pending ? "Setting up…" : label}
      </Button>
      {error && (
        <span className="error" role="alert" style={{ fontSize: 12, maxWidth: 260, textAlign: "right" }}>
          {error}
        </span>
      )}
    </div>
  );
}
