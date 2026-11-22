import type { NextRequest } from "next/server";
import { siteUrl } from "@/lib/auth.ts";
import { authClient } from "@/lib/supabase.ts";

export async function GET(req: NextRequest) {
  const base = siteUrl(req.nextUrl.origin);
  const code = req.nextUrl.searchParams.get("code");
  if (code) {
    const { error } = await (await authClient()).auth.exchangeCodeForSession(code);
    if (!error) return Response.redirect(`${base}/challenges`, 302);
  }
  return Response.redirect(`${base}/?error=signin`, 302);
}
