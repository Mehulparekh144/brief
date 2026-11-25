"use client";
import { useReducedMotion } from "motion/react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { fmt } from "@/lib/format.ts";

/** A number that counts up to its value (Magic UI NumberTicker). Plain text under reduced motion. */
export function Count({ value, className }: { value: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{fmt(value)}</span>;
  return <NumberTicker value={value} className={`text-inherit tracking-normal ${className ?? ""}`} />;
}
