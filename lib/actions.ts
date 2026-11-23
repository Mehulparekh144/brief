"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "./auth.ts";
import { db } from "./supabase.ts";

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
