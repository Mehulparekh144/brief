import Link from "next/link";
import type { Me } from "@/lib/auth.ts";
import { Analytics } from "./Analytics.tsx";
import { ReportButton } from "./Report.tsx";

export function Topbar({ me }: { me: Me | null }) {
  return (
    <header className="topbar">
      <Analytics userId={me?.id} login={me?.login} />
      <Link href={me?.approved ? "/challenges" : "/"} className="wm">
        <b>brief</b>lab
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
              <button className="btn">Sign out</button>
            </form>
          </>
        ) : (
          <a className="btn primary" href="/auth/login">
            Sign in with GitHub
          </a>
        )}
      </nav>
      {me?.approved && <ReportButton />}
    </header>
  );
}
