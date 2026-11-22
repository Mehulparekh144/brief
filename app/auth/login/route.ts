import type { NextRequest } from "next/server";
import { siteUrl } from "@/lib/auth.ts";
import { authClient } from "@/lib/supabase.ts";

export async function GET(req: NextRequest) {
  const supabase = await authClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${siteUrl(req.nextUrl.origin)}/auth/callback` },
  });
  if (error || !data.url) return Response.json({ error: error?.message ?? "Sign-in failed." }, { status: 500 });
  return Response.redirect(data.url, 302);
}
