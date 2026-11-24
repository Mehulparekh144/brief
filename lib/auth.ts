import "server-only";
import { redirect } from "next/navigation";
import { authClient, db } from "./supabase.ts";

export type Me = { id: string; login: string; avatar: string | null; approved: boolean; admin: boolean };

// Admins by GitHub numeric user id: it never changes, unlike a login, and users cannot edit their identities.
const adminIds = () =>
  (process.env.ADMIN_GITHUB_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** The signed-in user, or null. */
export async function currentUser(): Promise<Me | null> {
  const { data } = await (await authClient()).auth.getUser();
  if (!data.user) return null;
  const { data: p } = await db().from("profiles").select("github_login, avatar_url, approved").eq("id", data.user.id).maybeSingle();
  const login: string = p?.github_login ?? data.user.user_metadata?.user_name ?? ""; // display only
  const githubId = data.user.identities?.find((i) => i.provider === "github")?.id;
  const admin = Boolean(githubId && adminIds().includes(githubId));
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

/**
 * Body of a state-changing API call. Requires Content-Type: application/json: a cross-site HTML form
 * cannot send that without a CORS preflight, so this blocks CSRF on top of SameSite=Lax cookies.
 */
export async function jsonBody(req: Request): Promise<Record<string, unknown> | Response> {
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return Response.json({ error: "Send JSON." }, { status: 415 });
  }
  const text = await req.text();
  let body: unknown = {}; // an empty body is fine for actions like stop and submit
  try {
    if (text.trim()) body = JSON.parse(text);
  } catch {
    body = null;
  }
  return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : Response.json({ error: "Bad request body." }, { status: 400 });
}

/** At most `limit` feedback rows (ratings, notes, reports) per user per hour. Counted in the DB: works across processes. */
export async function feedbackRateLimited(userId: string, limit = 20): Promise<Response | null> {
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await db().from("feedback").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", since);
  return (count ?? 0) >= limit ? Response.json({ error: "Too many reports in the last hour. Try again later." }, { status: 429 }) : null;
}

export const siteUrl = (requestOrigin: string) => process.env.SITE_URL || requestOrigin;
