import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { LinkTabs } from "@/components/LinkTabs.tsx";
import { Topbar } from "@/components/Topbar.tsx";
import { requireUser } from "@/lib/auth.ts";
import { db } from "@/lib/supabase.ts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reports" };

const KIND_LABEL: Record<string, string> = { bug: "Bug", feature: "Feature", confusing: "Confusing", other: "Other", note: "Note", rating: "Rating" };
const KIND_TONE: Record<string, "good" | "warn" | "bad"> = { bug: "bad", feature: "good", confusing: "warn" };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ kind?: string; status?: string }> }) {
  const me = await requireUser();
  if (!me.admin) notFound();
  const { kind, status = "open" } = await searchParams;
  let q = db().from("feedback").select("id, kind, title, text, rating, status, session_id, created_at, user_id, context").order("created_at", { ascending: false }).limit(200);
  if (kind) q = q.eq("kind", kind);
  if (status === "open") q = q.neq("status", "done");
  const { data: rows } = await q;
  const { data: logins } = await db().from("profiles").select("id, github_login");
  const who = new Map((logins ?? []).map((p) => [p.id, p.github_login]));
  const { data: ratings } = await db().from("feedback").select("rating").eq("kind", "rating");
  const avg = ratings?.length ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : null;
  const link = (k?: string, s?: string) => `/admin?${new URLSearchParams({ ...(k ? { kind: k } : {}), ...(s ? { status: s } : {}) })}`;

  return (
    <>
      <Topbar me={me} />
      <main className="page">
        <header style={{ display: "grid", gap: 6 }}>
          <p className="label">Admin</p>
          <h1>Reports</h1>
          <p className="muted">
            Debrief ratings: {ratings?.length ?? 0}
            {avg !== null && ` · average ${avg.toFixed(2)} / 5`}
          </p>
        </header>
        <div className="flex flex-wrap items-end justify-between gap-3 border-b">
          <LinkTabs
            label="Report type"
            value={kind ?? "all"}
            tabs={[undefined, "bug", "feature", "confusing", "other", "note", "rating"].map((k) => ({ value: k ?? "all", label: k ? KIND_LABEL[k] : "All", href: link(k, status) }))}
          />
          <LinkTabs
            label="Report status"
            value={status}
            tabs={[
              { value: "open", label: "Open", href: link(kind, "open") },
              { value: "all", label: "Include done", href: link(kind, "all") },
            ]}
          />
        </div>
        <Card className="px-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>When (UTC)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(rows ?? []).map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="num muted">{r.id}</TableCell>
                  <TableCell>
                    <Badge variant={(KIND_TONE[r.kind] ?? "") || "secondary"} className="font-num">{KIND_LABEL[r.kind] ?? r.kind}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/reports/${r.id}`}>{r.title ?? (r.rating ? `Rated ${r.rating}/5` : (r.text ?? "").slice(0, 80))}</Link>
                  </TableCell>
                  <TableCell>{who.get(r.user_id) ?? "—"}</TableCell>
                  <TableCell className="num" style={{ fontSize: 11 }}>
                    {r.session_id ? r.session_id.slice(0, 8) : "—"}
                  </TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell className="num" style={{ fontSize: 11 }}>
                    {r.created_at.slice(0, 16).replace("T", " ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!rows?.length && <p className="muted">Nothing here.</p>}
        </Card>
      </main>
    </>
  );
}
