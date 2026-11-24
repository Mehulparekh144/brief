import { apiUser, feedbackRateLimited, jsonBody } from "@/lib/auth.ts";
import { db } from "@/lib/supabase.ts";

export async function POST(req: Request) {
  const me = await apiUser();
  if (me instanceof Response) return me;
  const body = await jsonBody(req);
  if (body instanceof Response) return body;
  const limited = await feedbackRateLimited(me.id);
  if (limited) return limited;
  const rating = body.rating == null ? null : Number(body.rating);
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 4000) : "";
  if (rating !== null && !(Number.isInteger(rating) && rating >= 1 && rating <= 5)) return Response.json({ error: "Rating must be 1 to 5." }, { status: 400 });
  if (rating === null && !text) return Response.json({ error: "Write something first." }, { status: 400 });
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  if (sessionId) {
    const { data } = await db().from("sessions").select("user_id").eq("id", sessionId).maybeSingle();
    if (data?.user_id !== me.id) return Response.json({ error: "Not your session." }, { status: 403 });
  }
  const { error } = await db()
    .from("feedback")
    .insert({ user_id: me.id, session_id: sessionId, kind: rating === null ? "note" : "rating", rating, text: text || null, page: typeof body.page === "string" ? body.page.slice(0, 200) : null });
  if (error) return Response.json({ error: "Could not save. Try again." }, { status: 500 });
  return Response.json({ ok: true });
}
