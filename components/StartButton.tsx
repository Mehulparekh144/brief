"use client";
import { useFormStatus } from "react-dom";
import { track } from "./Analytics.tsx";

export function StartButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn primary" disabled={pending} onClick={() => track(label === "Start" ? "challenge_started" : "challenge_retried", { label })}>
      {pending ? "Setting up…" : label}
    </button>
  );
}
