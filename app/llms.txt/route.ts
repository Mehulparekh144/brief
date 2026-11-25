import { DESCRIPTION, SITE } from "@/lib/format.ts";
import { CATEGORIES, listChallenges } from "@/src/challenge.ts";

/** A plain summary of the site for AI tools (llms.txt format). */
export function GET() {
  const n = listChallenges().length;
  const body = `# Brieflab

> ${DESCRIPTION}

Brieflab is a practice site for developers who use AI coding agents. You read a coding task, then brief an agent in a sandbox. A live meter counts every token. Hidden tests grade the result. A coach (Brie) shows the cost of each message and a better first message. Par is the token count of a good reference brief.

- ${n} challenges in JavaScript and Python, in five categories: ${Object.values(CATEGORIES).join(", ")}.
- Sign-in: GitHub. Private beta: new accounts join a waitlist.

## Pages

- [Home](${SITE}/): what Brieflab is and how it works
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
