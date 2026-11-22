import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Topbar } from "@/components/Topbar.tsx";
import { Workspace } from "@/components/Workspace.tsx";
import { requireUser } from "@/lib/auth.ts";
import { staleBefore } from "@/lib/format.ts";
import { db } from "@/lib/supabase.ts";
import { capFor, loadChallenge } from "@/src/challenge.ts";

export const dynamic = "force-dynamic";

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  const { data: row } = await db().from("sessions").select("user_id, status, challenge, heartbeat_at").eq("id", id).maybeSingle();
  if (!row || row.user_id !== me.id) notFound();
  if (row.status === "submitted") redirect(`/s/${id}/debrief`);

  // Pages may run in another process than the live session (next dev), so read its state from the database.
  // A just-started session has a fresh heartbeat; the stream route returns 410 if the server lost it anyway.
  if (row.status !== "active" || row.heartbeat_at < staleBefore()) {
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
  const ch = loadChallenge(row.challenge);
  return <Workspace id={id} slug={ch.slug} title={ch.title} difficulty={ch.difficulty} skill={ch.skill} statement={ch.statement} par={ch.par ?? null} cap={capFor(ch)} />;
}
