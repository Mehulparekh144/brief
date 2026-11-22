import { liveCount } from "@/lib/live.ts";

export const dynamic = "force-dynamic";

/** For the host's health check. No auth, no data. */
export function GET() {
  return Response.json({ ok: true, liveSessions: liveCount() });
}
