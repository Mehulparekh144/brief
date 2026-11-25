"use client";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PAR_TEXT } from "@/lib/format.ts";

const TONE = { easy: "good", medium: "warn", hard: "bad" } as const;

export function DifficultyChip({ level }: { level: "easy" | "medium" | "hard" }) {
  return (
    <Badge variant={TONE[level]} className="font-num tracking-wider">
      {level.toUpperCase()}
    </Badge>
  );
}

/** "What is par?" with a small popover. */
export function ParHelp({ label = "What is par?" }: { label?: string }) {
  return (
    <Popover>
      <PopoverTrigger className="help">{label}</PopoverTrigger>
      <PopoverContent align="end" className="w-80 border-l-4 border-l-[var(--hl-line)] text-sm leading-relaxed">
        {PAR_TEXT}
      </PopoverContent>
    </Popover>
  );
}
