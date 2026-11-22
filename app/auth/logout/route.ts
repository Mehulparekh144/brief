import type { NextRequest } from "next/server";
import { siteUrl } from "@/lib/auth.ts";
import { authClient } from "@/lib/supabase.ts";

export async function POST(req: NextRequest) {
  await (await authClient()).auth.signOut();
  return Response.redirect(`${siteUrl(req.nextUrl.origin)}/`, 303);
}
