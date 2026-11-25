import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Me } from "@/lib/auth.ts";
import { Analytics } from "./Analytics.tsx";
import { Logo } from "./Brie.tsx";
import { ReportButton } from "./Report.tsx";

export function Topbar({ me }: { me: Me | null }) {
  return (
    <header className="topbar">
      <Analytics userId={me?.id} login={me?.login} />
      <Link href={me?.approved ? "/challenges" : "/"} className="logo-link" aria-label="Brieflab home">
        <Logo />
      </Link>
      <nav>
        {me ? (
          <>
            {me.approved && <Link href="/challenges">Practice</Link>}
            {me.approved && <Link href="/me">My sessions</Link>}
            {me.admin && <Link href="/admin">Reports</Link>}
            {me.avatar && <img className="avatar" src={me.avatar} alt="" />}
            <span className="muted">{me.login}</span>
            <form action="/auth/logout" method="post">
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </>
        ) : (
          <Button asChild>
            <a href="/auth/login">Sign in with GitHub</a>
          </Button>
        )}
      </nav>
      {me?.approved && <ReportButton />}
    </header>
  );
}
