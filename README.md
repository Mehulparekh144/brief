# Brieflab

A practice site for guiding AI coding agents. You brief an agent on a real coding task. A live meter counts every token. Hidden tests grade the result. A coach shows where your tokens went and how to brief better.

## How it works

```mermaid
flowchart LR
    B[Browser: files, editor, chat, meter] -- message --> S[Next.js server]
    S -- steps (SSE) --> B
    S --> L[Agent loop, 1 per session]
    L -- model calls --> C[Claude API: Haiku 5.5]
    L -- bash + edit tools --> X[E2B sandbox: no internet, no keys]
    S --> G[Grader: hidden tests] --> K[Coach: Opus 5.5]
    S --> D[(Supabase: sessions, events, reports)]
```

- The agent loop runs on the server. Only tools run in the sandbox, so API keys never enter it.
- Every model call is metered: input, cache write, cache read and output tokens.
- **Par** is the token count of a good brief: the median of 3 reference runs (`npm run calibrate`).

## Run it

1. `npm install`
2. Copy `.env.example` to `.env` and fill it in (Claude, E2B and Supabase keys).
3. `npm run migrate` creates the tables.
4. `npm run dev`, then open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Web app |
| `npm run check` | Type-check, and check that each challenge's start fails and its solution passes (no API calls) |
| `npm run e2e` | End-to-end test against the running app (about $0.02) |
| `npm run play -- <challenge>` | Play a challenge in the terminal |
| `npm run calibrate -- [challenge]` | The 2× rule: 3 good + 3 lazy runs, writes `par.json` |
| `npm run migrate` | Applies `supabase/migrations/*.sql` |

## Add a challenge

Create `challenges/<slug>/` with `challenge.json`, `statement.md`, `repo/`, `hidden/` and `solution/`. Run `npm run check`, then `npm run calibrate -- <slug>`. Ship it only if it passes the 2× rule; otherwise set `"draft": true`.
