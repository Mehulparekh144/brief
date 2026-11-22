"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "./auth.ts";
import { startSession, UserError } from "./live.ts";
import { db } from "./supabase.ts";

/** Form action: start (or resume) a challenge session, then open its workspace. */
export async function startChallenge(form: FormData) {
  const me = await requireUser();
  let id: string;
  try {
    id = await startSession(me.id, String(form.get("slug")), me.admin);
  } catch (e) {
    if (!(e instanceof UserError)) console.error("start:", e);
    const msg = e instanceof UserError ? e.message : "Could not start the session. Try again.";
    redirect(`/challenges?error=${encodeURIComponent(msg)}`);
  }
  redirect(`/s/${id}`);
}

/** Admin form action: move a report to new / triaged / done. */
export async function setReportStatus(form: FormData) {
  const me = await requireUser();
  if (!me.admin) return;
  const status = String(form.get("status"));
  if (!["new", "triaged", "done"].includes(status)) return;
  const id = Number(form.get("id"));
  await db().from("feedback").update({ status }).eq("id", id);
  revalidatePath(`/admin/reports/${id}`);
  revalidatePath("/admin");
}
