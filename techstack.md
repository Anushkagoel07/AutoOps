# techstack.md — AutoOps Technology Stack

## 1. Core Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | Single deployable app for frontend + backend (API routes), fast Vercel deploy |
| Styling | Tailwind CSS | Fast, clean, minimal premium look — matches hackathon's "premium minimalist" guidance |
| Charts | Recharts | Simple React-native charting, easy analytics visuals |
| AI Agent | Groq API (`groq-sdk`) | Free tier, very fast inference, supports function/tool calling for structured output |
| Data/Analytics Layer | Neural Pulse API (`evorozen` SDK/REST) | Required primary logic/data layer for the hackathon's bonus multiplier |
| Deployment | Vercel | Free, instant live link, zero backend hosting complexity |
| Package Manager | npm or pnpm | Standard, no special requirement |

---

## 2. Groq Setup

- Model: a Groq-hosted Llama 3.3/4 (or current best function-calling-capable model available on Groq at build time — check `console.groq.com` for current model list)
- Use **tool/function calling**, not raw prompt + manual JSON parsing, so output is structurally enforced
- Environment variable: `GROQ_API_KEY`
- Free tier — monitor request volume during demo data seeding to avoid hitting rate limits (see `rules.md` and `architecture.md` error handling)

---

## 3. Neural Pulse Setup

- Base URL + API key issued by hackathon organizers (confirm access before build day)
- Environment variables: `NEURAL_PULSE_API_KEY`, `NEURAL_PULSE_BASE_URL`
- Tables needed: `requests`, `agent_activity`, `escalations`, `leads`
- Use `chat()` / `createSchema()` for initial schema setup (plain-English) — do this once, document the exact prompt used in `lib/neuralpulse/schema-setup.ts` as a comment
- Use `insert`, `select`, `update`, `bulkInsert` for normal CRUD during the request lifecycle
- Use `analytics(prompt, table)` for the "Ask Neural Pulse" natural-language query feature

---

## 4. Frontend Libraries

- `react`, `react-dom` (bundled with Next.js)
- `tailwindcss`, `postcss`, `autoprefixer`
- `recharts`
- No UI kit (MUI, Chakra, shadcn) required unless the team wants faster prototyping — if used, keep it minimal and Tailwind-compatible (shadcn/ui is acceptable since it's Tailwind-based; note this in `rules.md` if adopted)

---

## 5. Backend Libraries (within Next.js API routes)

- `groq-sdk` — Groq client
- Neural Pulse client — per their official SDK/REST docs (check `pulse.evorozen.com/docs` for the current package name/language support; if no JS/TS SDK exists, use `fetch` directly against their REST endpoints)
- `zod` (recommended) — for validating the agent's JSON output against the schema in `agents.md` before executing any action
- No ORM, no separate database driver — Neural Pulse is the only data layer

---

## 6. Dev Tooling

- TypeScript
- ESLint + Prettier (default Next.js config is fine)
- No test framework required for MVP (see `rules.md`)

---

## 7. Environment Variables (`.env.local`)

```env
GROQ_API_KEY=your_groq_key_here
NEURAL_PULSE_API_KEY=your_neural_pulse_key_here
NEURAL_PULSE_BASE_URL=https://pulse.evorozen.com/api
```

Never commit `.env.local`. Add it to `.gitignore` (default in Next.js starter already does this).

---

## 8. Explicitly Not Used

See `rules.md` §1 "Explicitly avoid" for the full list — summarized: no separate Express backend, no external database/ORM, no auth provider, no payment processor, no websockets, no OpenAI SDK, no state management library beyond React built-ins.
