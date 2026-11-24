import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const env = (name: string) => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} in .env`);
  return v;
};

// Only the server talks to Supabase, so page scripts never need the auth cookie: keep it httpOnly.
export const COOKIE_OPTIONS = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };

/** Signed-in user's client (cookies). Use only for auth calls. */
export async function authClient() {
  const store = await cookies();
  return createServerClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"), {
    cookieOptions: COOKIE_OPTIONS,
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only. proxy.ts refreshes the session.
        }
      },
    },
  });
}

let admin: SupabaseClient | undefined;

/** Server-only client with the secret key. Bypasses RLS: never send it to a browser. */
export function db(): SupabaseClient {
  admin ??= createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("SUPABASE_SECRET_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
