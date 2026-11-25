# HANDOFF — Brieflab (agent practice platform)

Last updated: 2026-11-24

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

## Challenges (2026-11-23)
58 challenges: 56 live, 2 drafts (`cookie-parse`, `word-wrap`: a lazy brief also passes, 1.6–1.7× par).
Categories (`category` in challenge.json, tabs on Practice): bug-fix 15, spec 24, refactor 6, testing 6, security 7. Difficulty: easy 14, medium 34, hard 10.
Every live challenge passed the 2× rule on Haiku 5.5; par values are in each `challenges/<slug>/par.json`.
50 were added on 2026-11-23 by 5 parallel writers, then checked with `check-challenges.sh` and calibrated (about $0.30).
`amortization` needed exact rounding points in the statement: "round every money value" was ambiguous.

## Calibration of the first 8 (Haiku 5.5, harness v1)
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

## Security review (2026-11-23)
Checked against the security-review checklist (github.com/WorldFlowAI/everything-claude-code, skills/security-review).
- Fixed: `_migrations` had RLS off and full anon grants (readable and writable with the public key) → migration 004.
- Added: httpOnly auth cookies; CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS (prod) in `next.config.ts`;
  JSON-only state-changing API calls (`jsonBody`, CSRF defense on top of SameSite=Lax); 20 reports/ratings per user per hour; Dependabot.
- Already fine: no secrets in code or git history, `npm audit` clean, Supabase query builder only (no raw SQL), React escaping
  (one `dangerouslySetInnerHTML`, on highlight.js output, which escapes), ownership and admin checks on every route, generic errors.
- Kept SameSite=Lax (not Strict): Strict drops the session when users arrive from another site.

## Mascot and logo (2026-11-24)
- Mascot: **Brie**, a highlighter-yellow briefing card (user picked her from 3 concepts). `components/Brie.tsx`: moods neutral, happy, worried, shocked, thinking.
- Mood follows the meter (`moodFor` in `lib/format.ts`): thinking while the agent works, shocked near the cap, worried over par, happy at or under par.
- Logo lockup `<Logo />` (Brie mark + "brieflab" wordmark): top bars and large on the landing page. Favicon: `app/icon.svg`.
- Brie is the coach's face ("Brie's debrief"). She is not the agent: the agent stays a plain tool in the chat.

## SEO (2026-11-24)
Applied the on-page, technical, schema and agent-readiness checklists from github.com/AgricIDaniel/claude-seo (read as data; the plugin and its scripts were not installed).
- Landing: title 44 chars, description 158, canonical, Open Graph + Twitter card, `app/opengraph-image.tsx` (Brie + tagline), JSON-LD (Organization + WebApplication), a "What you practice" section.
- `app/robots.ts` (private paths disallowed; AI crawlers allowed on the landing page), `app/sitemap.ts`, `app/llms.txt/route.ts`, tab titles on every page (`%s · Brieflab`).
- `robots.txt`, `sitemap.xml` and the OG image are static at build time: set `SITE_URL` before the production build.

## shadcn + Magic UI (2026-11-24)
User asked for shadcn and Magic UI components, and the awwwards skill (github.com/ga14ctic/awwwards-skill, read as data, nothing installed).
- Tailwind v4 + shadcn (style `radix-nova`, `components.json`). Parts in `components/ui/`: button, badge, card, dialog, tabs, popover, table, input, textarea, select, label, skeleton.
- Magic UI parts: number-ticker (`components/Count.tsx`), marquee, dot-pattern, shimmer-button (`components/ShimmerLink.tsx`), border-beam, animated-shiny-text. Confetti on a passed debrief (`components/Celebrate.tsx`).
- Brand stays the same: shadcn tokens (`--background`, `--primary`, …) map to the Brieflab tokens in `app/globals.css`. Badge has `good`, `warn`, `bad`, `hl` variants.
- Converted: Report dialog, par popover, difficulty chips, all tables, tab bars (`components/LinkTabs.tsx`), buttons, inputs.
- Landing rebuilt (awwwards brief): dot-grid hero, "Same fix. Half the tokens.", a measured brief race (`components/BriefRace.tsx`, real late-fees calibration: 16,290 vs 7,685 tokens), challenge marquee, step cards, category bento.
- Checked in a browser at 375, 768, 1280 and 1920 px, dark and light: no horizontal scroll, no dev-overlay issues, only same-origin requests.

## Final security review before deploy (2026-11-24)
Re-ran the checklist on `main` (after Brie and TypeScript 7), and again on top of #15–#17. No new issues in code.
- No secrets in git history (all branches). `npm audit --omit=dev`: 0 (the `shadcn` CLI is a dev dependency; its `minimatch` advisory does not ship).
- Two `dangerouslySetInnerHTML`: escaped highlight.js output, and the landing JSON-LD with `<` escaped.
- RLS on all 5 tables, no policies. With the public key: every table returns `[]` or "permission denied"; inserts blocked.
  `handle_new_user` is security definer with an empty search_path, and anon cannot execute it.
- Production build: CSP without `unsafe-eval`, HSTS, `Secure HttpOnly SameSite=lax` cookies, `/.env` and challenge solutions are not served.
- Open item: the dev Supabase project has the Email provider on (only for the e2e test user). Production must use a separate project with Email off.
- Deploy prep: `railway.json` (1 replica, health check, restart on failure) and a full runbook in README → Deploy.

## Key decisions and why
- Agent loop on our server; only tools run in the sandbox (no keys or internet inside). No LiteLLM.
- Manual loop instead of the SDK tool runner: cap checks before each call and per-message token counts.
- Live sessions in server memory (`shortcut:` comment in `lib/live.ts`). One server only; a redeploy ends live sessions.
- Only API routes import `lib/live.ts`. Pages read session state from the database (`status`, `heartbeat_at`). Starts go through `POST /api/sessions` from the browser, not a server action.
- Live sessions write `heartbeat_at` every 15 s. A sweep (on start, every 5 min) closes sessions silent for 60 s and kills sandboxes without an active session (sandbox metadata: app, site, session).
- All DB access on the server with the secret key; RLS on with no policies, so browsers have no table access.
- shadcn + Magic UI for components (user's choice). The older Brieflab CSS stays in `@layer components`, so Tailwind utilities on a component override it.
- Nav labels: "Practice" and "My sessions" (user's choice). Feedback is one "Report" dialog with types.
- Coach on Claude Opus 5.5 with `fallbacks: "default"` (server-side refusal fallback, beta `server-side-fallback-2026-07-01`).

## Gotchas
- Motion: use the timing tokens in `app/globals.css` (`--dur-*`, `--ease-*`). Animate only transform and opacity. Put every animation inside `@media (prefers-reduced-motion: no-preference)`, and hover effects inside `@media (hover: hover)`.
- shadcn: our muted text color is `--ink-3`. `--muted` is shadcn's muted *background*. Dark mode is the media query (`@custom-variant dark`), not a `.dark` class.
- shadcn files that use hooks need `"use client"` (`components.json` has `rsc: true`, so new `npx shadcn add` files get it).
- Do not add the Geist font that `shadcn init` adds: `--font-sans` maps to our `--font-ui`.
- canvas-confetti draws in a blob worker: the CSP needs `worker-src 'self' blob:`.
- If you add a third-party script, image or API host, add it to the CSP in `next.config.ts`, or the browser blocks it.
- New tables need `enable row level security` in their migration (the public key can reach every table in `public`).
- Calibrate many challenges from bash, not zsh: zsh does not split `$VAR` into words (`bash -c 'npm run calibrate -- $NEW'`).
- A good brief that fails calibration usually means the statement is ambiguous (see `amortization`): fix the statement, not the tests.
- Links: no underline by default (`a:hover, p a` only). Use `components/LinkTabs.tsx` for tab bars.
- `npm run e2e` deletes the e2e user's sessions and feedback, so test data stays out of Admin → Reports.
- `next dev` serves pages, server actions and API routes from **separate processes**; `next start` uses one. Never share in-memory state between a page and an API route.
- Next.js 16: `middleware.ts` is now `proxy.ts`. `params`/`searchParams` are promises. Read `node_modules/next/dist/docs/` first (see AGENTS.md).
- TypeScript 7.0 builds with Next.js 16.4 here (`npx tsc --noEmit` and `next build` pass).
- `src/challenge.ts` reads `challenges/` from `process.cwd()`; a `new URL(..., import.meta.url)` there breaks the Next build.
- Do not run `next build` while `next dev` runs in the same folder if you see odd dev errors; restart dev.
- E2B base template: Node 20.9, Python 3.11, git. Internet off. Challenges must need no packages.
- Supabase free projects pause after 1 week idle.
- Haiku 5.5 cache prices in `src/meter.ts` are assumed (1.25× write, 0.1× read).

## Next steps
0. Merge the open PRs in this order: #15, #16, #17, #14. #14 is stacked on #17: if GitHub does not retarget it to `main` after #17 merges, change its base by hand.
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
