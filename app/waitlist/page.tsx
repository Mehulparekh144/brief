import { redirect } from "next/navigation";
import { Brie } from "@/components/Brie.tsx";
import { Topbar } from "@/components/Topbar.tsx";
import { currentUser } from "@/lib/auth.ts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Waitlist" };

export default async function Waitlist() {
  const me = await currentUser();
  if (!me) redirect("/");
  if (me.approved) redirect("/challenges");
  return (
    <>
      <Topbar me={me} />
      <main className="page narrow">
        <p className="label">Private beta</p>
        <Brie mood="neutral" size={72} />
        <h1>You are on the list, {me.login}.</h1>
        <p>We let people in a few at a time, so we can read every session and fix problems fast. We will approve your account soon. Then sign in again.</p>
      </main>
    </>
  );
}
