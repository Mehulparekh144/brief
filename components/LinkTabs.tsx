"use client";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type LinkTab = { value: string; label: string; href: string; count?: number };

/** shadcn Tabs whose triggers are links, so each tab has its own URL (filters that survive reload and share). */
export function LinkTabs({ tabs, value, label }: { tabs: LinkTab[]; value: string; label: string }) {
  return (
    <Tabs value={value}>
      <TabsList variant="line" aria-label={label} className="h-auto flex-wrap justify-start">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} asChild>
            <Link href={t.href}>
              {t.label}
              {t.count !== undefined && <span className="ml-1 font-num text-[11px] text-muted-foreground">{t.count}</span>}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
