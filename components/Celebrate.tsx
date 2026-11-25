"use client";
import confetti from "canvas-confetti";
import { useEffect } from "react";

/** One burst of confetti when the page opens (beating par). Skipped under reduced motion. */
export function Celebrate() {
  useEffect(() => {
    void confetti({ particleCount: 90, spread: 70, origin: { y: 0.3 }, colors: ["#F7E36A", "#14181D", "#4CC38A"], disableForReducedMotion: true });
  }, []);
  return null;
}
