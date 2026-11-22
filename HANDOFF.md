# HANDOFF — Brieflab (agent practice platform)

Last updated: 2026-11-22

- Plan (scope, design, brand, costs, timeline): https://claude.ai/artifact/HTejiT3ahANGfuASqt7b2J
- Repo: https://github.com/Mehulparekh144/brief (private). Work lands as one PR per task.

## What was built
**Week 1 (spike):** terminal agent loop, E2B tools, meter, calibration, 3 challenges.

**Weeks 2–4 (web app, PR "MVP"):**
| Area | Files |
|---|---|
| Sign-in (GitHub via Supabase), approval gate, waitlist, admins via `ADMIN_LOGINS` | `lib/auth.ts`, `lib/supabase.ts`, `proxy.ts`, `app/auth/*`, `app/waitlist` |
| Live sessions: start, message, stop, public tests, submit, SSE stream, limits (1 live session, 5/day, $20/day site cap, 30 min, 10 min idle) | `lib/live.ts`, `app/api/sessions/**` |
| Workspace: file tree, editor tabs with syntax colors, task tab, chat, live meter, par help | `components/Workspace.tsx`, `Code.tsx`, `Meter.tsx`, `Bits.tsx` |
| Grading + coach (Claude Opus 5.5, structured JSON, server-side refusal fallback) | `lib/live.ts` (`submit`), `lib/coach.ts` |
| Debrief page (score, tokens per message, tips, better first message, par brief, diff, rating) | `app/s/[id]/debrief` |
| Practice list (difficulty, par, your best), My sessions, landing page | `app/challenges`, `app/me`, `app/page.tsx` |
| Reports (bug / feature / confusing / other, linked to a session, page + browser context) and admin triage with full transcript | `components/Report.tsx`, `app/api/reports`, `app/admin/**` |
| Analytics (PostHog, only when `NEXT_PUBLIC_POSTHOG_KEY` is set) | `components/Analytics.tsx` |
| 8 challenges, all live | `challenges/*` |
| Tests: challenge self-check, e2e smoke test | `scripts/check-challenges.sh`, `scripts/e2e.ts` |

## Calibration (Haiku 5.5, harness v1)
| Challenge | Level | Par | Lazy | Rule |
|---|---|---|---|---|
| late-fees | easy | 7,685 | 2.1× | pass |
| three-asks | easy | 10,187 | 3.2×, fails | pass |
| fuzzy-spec | medium | 8,726 | 1.3×, fails | pass |
| needle | medium | 7,724 | 2.0× | pass (just) |
| just-the-export | medium | 7,211 | 1.6×, fails | pass |
| slow-suite | medium | 7,154 | 2.1× | pass |
| wrong-turn | hard | 6,680 | 2.7×, fails | pass |
| test-writer | medium | 8,321 | 1.5×, fails | pass (table-test format, PR #5) |

Measured cost: agent ≈ $0.001 per session, coach ≈ $0.01–0.02. The sandbox is now the main cost.

## Key decisions and why
- Agent loop on our server; only tools run in the sandbox (no keys or internet inside). No LiteLLM.
- Manual loop instead of the SDK tool runner: cap checks before each call and per-message token counts.
- Live sessions in server memory (`shortcut:` comment in `lib/live.ts`). One server only; a redeploy ends live sessions.
- Only API routes import `lib/live.ts`. Pages read session state from the database (`status`, `heartbeat_at`). Starts go through `POST /api/sessions` from the browser, not a server action.
- Live sessions write `heartbeat_at` every 15 s. A sweep (on start, every 5 min) closes sessions silent for 60 s and kills sandboxes without an active session (sandbox metadata: app, site, session).
- All DB access on the server with the secret key; RLS on with no policies, so browsers have no table access.
- Plain CSS with brand tokens (no Tailwind/shadcn): the design was already written as CSS.
- Nav labels: "Practice" and "My sessions" (user's choice). Feedback is one "Report" dialog with types.
- Coach on Claude Opus 5.5 with `fallbacks: "default"` (server-side refusal fallback, beta `server-side-fallback-2026-07-01`).

## Gotchas
- `next dev` serves pages, server actions and API routes from **separate processes**; `next start` uses one. Never share in-memory state between a page and an API route.
- Next.js 16: `middleware.ts` is now `proxy.ts`. `params`/`searchParams` are promises. Read `node_modules/next/dist/docs/` first (see AGENTS.md).
- TypeScript is pinned to 5.9 (Next.js does not support TS 7 yet).
- `src/challenge.ts` reads `challenges/` from `process.cwd()`; a `new URL(..., import.meta.url)` there breaks the Next build.
- Do not run `next build` while `next dev` runs in the same folder if you see odd dev errors; restart dev.
- E2B base template: Node 20.9, Python 3.11, git. Internet off. Challenges must need no packages.
- Supabase free projects pause after 1 week idle.
- Haiku 5.5 cache prices in `src/meter.ts` are assumed (1.25× write, 0.1× read).

## Next steps
1. Deploy to Railway (needs your account). Set env vars, `SITE_URL`, and add the prod callback URL in Supabase.
2. PostHog key (optional) for funnels and session replay.
3. Consider harder variants of `needle` and `late-fees` (close to 2×).
4. Private alpha with 10–15 people; read transcripts in Admin → Reports.

## How to run
```bash
npm install
cp .env.example .env     # fill in keys
npm run migrate
npm run dev              # http://localhost:3000
npm run check            # type-check + challenge self-check
npm run e2e              # with the dev server running
```
