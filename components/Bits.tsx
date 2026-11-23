"use client";
import { useState } from "react";
import { PAR_TEXT } from "@/lib/format.ts";

export function DifficultyChip({ level }: { level: "easy" | "medium" | "hard" }) {
  return <span className={`pill diff-${level}`}>{level.toUpperCase()}</span>;
}

/** "What is par?" with a small popover. */
export function ParHelp({ label = "What is par?" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="par-help">
      <button type="button" className="help" aria-expanded={open} onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}>
        {label}
      </button>
      {open && (
        <span role="tooltip" className="popover">
          {PAR_TEXT}
        </span>
      )}
    </span>
  );
}
