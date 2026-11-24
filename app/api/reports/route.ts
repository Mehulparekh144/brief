import { apiUser, feedbackRateLimited, jsonBody } from "@/lib/auth.ts";
import { db } from "@/lib/supabase.ts";
import { loadChallenge } from "@/src/challenge.ts";

const KINDS = ["bug", "feature", "confusing", "other"];

/** The user's recent sessions, so a report can point at one. */
export async function GET() {
  const me = await apiUser();
  if (me instanceof Response) return me;
  const { data } = await db().from("sessions").select("id, challenge, status, started_at").eq("user_id", me.id).order("started_at", { ascending: false }).limit(15);
  const title = (slug: string) => {
    try {
      return loadChallenge(slug).title;
    } catch {
      return slug;
    }
  };
  return Response.json({ sessions: (data ?? []).map((s) => ({ id: s.id, label: `${title(s.challenge)} · ${s.started_at.slice(0, 16).replace("T", " ")} UTC · ${s.status}` })) });
}

export async function POST(req: Request) {
  const me = await apiUser();
  if (me instanceof Response) return me;
  const b = await jsonBody(req);
  if (b instanceof Response) return b;
  const limited = await feedbackRateLimited(me.id);
  if (limited) return limited;
  const kind = typeof b.kind === "string" && KINDS.includes(b.kind) ? b.kind : null;
  const title = typeof b.title === "string" ? b.title.trim().slice(0, 140) : "";
  const text = typeof b.details === "string" ? b.details.trim().slice(0, 8000) : "";
  if (!kind) return Response.json({ error: "Choose a type." }, { status: 400 });
  if (!title) return Response.json({ error: "Write a short title." }, { status: 400 });
  let sessionId: string | null = typeof b.sessionId === "string" && b.sessionId ? b.sessionId : null;
  if (sessionId) {
    const { data } = await db().from("sessions").select("user_id").eq("id", sessionId).maybeSingle();
    if (data?.user_id !== me.id) sessionId = null; // only your own sessions can be attached
  }
  const ctx = (b.context && typeof b.context === "object" ? b.context : {}) as Record<string, unknown>;
  const context = {
    page: String(ctx.page ?? "").slice(0, 300),
    userAgent: String(req.headers.get("user-agent") ?? "").slice(0, 300),
    viewport: String(ctx.viewport ?? "").slice(0, 40),
    timezone: String(ctx.timezone ?? "").slice(0, 60),
    login: me.login,
  };
  const { data, error } = await db().from("feedback").insert({ user_id: me.id, session_id: sessionId, kind, title, text: text || null, context, page: context.page }).select("id").single();
  if (error) return Response.json({ error: "Could not save the report. Try again." }, { status: 500 });
  return Response.json({ id: data.id });
}
