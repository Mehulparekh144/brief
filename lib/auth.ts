import "server-only";
import { redirect } from "next/navigation";
import { authClient, db } from "./supabase.ts";

export type Me = { id: string; login: string; avatar: string | null; approved: boolean; admin: boolean };

const admins = () =>
  (process.env.ADMIN_LOGINS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

/** The signed-in user, or null. */
export async function currentUser(): Promise<Me | null> {
  const { data } = await (await authClient()).auth.getUser();
  if (!data.user) return null;
  const { data: p } = await db().from("profiles").select("github_login, avatar_url, approved").eq("id", data.user.id).maybeSingle();
  const login: string = p?.github_login ?? data.user.user_metadata?.user_name ?? "";
  const admin = admins().includes(login.toLowerCase());
  return { id: data.user.id, login, avatar: p?.avatar_url ?? null, approved: Boolean(p?.approved) || admin, admin };
}

/** For pages: signed-in and approved, or redirect. */
export async function requireUser(): Promise<Me> {
  const me = await currentUser();
  if (!me) redirect("/");
  if (!me.approved) redirect("/waitlist");
  return me;
}

/** For route handlers: the approved user, or an error response. */
export async function apiUser(): Promise<Me | Response> {
  const me = await currentUser();
  if (!me) return Response.json({ error: "Sign in first." }, { status: 401 });
  if (!me.approved) return Response.json({ error: "You are on the waitlist." }, { status: 403 });
  return me;
}

export const siteUrl = (requestOrigin: string) => process.env.SITE_URL || requestOrigin;
