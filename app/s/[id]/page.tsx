import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Topbar } from "@/components/Topbar.tsx";
import { Workspace } from "@/components/Workspace.tsx";
import { requireUser } from "@/lib/auth.ts";
import { getLive } from "@/lib/live.ts";
import { db } from "@/lib/supabase.ts";
import { capFor } from "@/src/challenge.ts";

export const dynamic = "force-dynamic";

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  const { data: row } = await db().from("sessions").select("user_id, status").eq("id", id).maybeSingle();
  if (!row || row.user_id !== me.id) notFound();
  if (row.status === "submitted") redirect(`/s/${id}/debrief`);

  const l = getLive(id, me.id);
  if (!l) {
    // The server restarted or the session ended without grading.
    if (row.status === "active") await db().from("sessions").update({ status: "error", ended_at: new Date().toISOString() }).eq("id", id);
    return (
      <>
        <Topbar me={me} />
        <main className="page narrow">
          <p className="notice bad">The workspace stopped. This attempt does not count. Start again.</p>
          <Link className="btn primary" href="/challenges" style={{ justifySelf: "start" }}>
            Back to practice
          </Link>
        </main>
      </>
    );
  }
  const ch = l.ch;
  return <Workspace id={id} slug={ch.slug} title={ch.title} difficulty={ch.difficulty} skill={ch.skill} statement={ch.statement} par={ch.par ?? null} cap={capFor(ch)} />;
}
