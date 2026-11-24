import { apiUser, jsonBody } from "@/lib/auth.ts";
import { startSession, UserError } from "@/lib/live.ts";

export async function POST(req: Request) {
  const me = await apiUser();
  if (me instanceof Response) return me;
  const body = await jsonBody(req);
  if (body instanceof Response) return body;
  const { challenge } = body;
  try {
    return Response.json({ id: await startSession(me.id, String(challenge ?? ""), me.admin) });
  } catch (e) {
    if (e instanceof UserError) return Response.json({ error: e.message }, { status: e.status });
    console.error("start:", e);
    return Response.json({ error: "Could not start the session." }, { status: 500 });
  }
}
