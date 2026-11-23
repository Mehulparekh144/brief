import Link from "next/link";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/Topbar.tsx";
import { requireUser } from "@/lib/auth.ts";
import { db } from "@/lib/supabase.ts";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = { bug: "Bug", feature: "Feature", confusing: "Confusing", other: "Other", note: "Note", rating: "Rating" };
const KIND_TONE: Record<string, string> = { bug: "bad", feature: "good", confusing: "warn" };

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
        <nav className="filter-tabs" aria-label="Filter reports">
          {[undefined, "bug", "feature", "confusing", "other", "note", "rating"].map((k) => (
            <Link key={k ?? "all"} href={link(k, status)} aria-current={kind === k ? "page" : undefined}>
              {k ? KIND_LABEL[k] : "All"}
            </Link>
          ))}
          <span className="spacer" />
          <Link href={link(kind, "open")} aria-current={status === "open" ? "page" : undefined}>
            Open
          </Link>
          <Link href={link(kind, "all")} aria-current={status === "all" ? "page" : undefined}>
            Include done
          </Link>
        </nav>
        <div className="tbl card">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Title</th>
                <th>User</th>
                <th>Session</th>
                <th>Status</th>
                <th>When (UTC)</th>
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).map((r) => (
                <tr key={r.id}>
                  <td className="num muted">{r.id}</td>
                  <td>
                    <span className={`pill ${KIND_TONE[r.kind] ?? ""}`}>{KIND_LABEL[r.kind] ?? r.kind}</span>
                  </td>
                  <td>
                    <Link href={`/admin/reports/${r.id}`}>{r.title ?? (r.rating ? `Rated ${r.rating}/5` : (r.text ?? "").slice(0, 80))}</Link>
                  </td>
                  <td>{who.get(r.user_id) ?? "—"}</td>
                  <td className="num" style={{ fontSize: 11 }}>
                    {r.session_id ? r.session_id.slice(0, 8) : "—"}
                  </td>
                  <td>{r.status}</td>
                  <td className="num" style={{ fontSize: 11 }}>
                    {r.created_at.slice(0, 16).replace("T", " ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows?.length && <p className="muted">Nothing here.</p>}
        </div>
      </main>
    </>
  );
}
