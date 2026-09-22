# rules.md — AutoOps Project Rules for AI-Assisted Development

This file defines the boundaries for any AI (Claude Code, Cursor, Copilot, etc.) working on this codebase. Follow these rules strictly when generating or editing code for this project.

---

## 1. Tech Stack Boundaries

### Use these libraries only
- **Framework:** Next.js (App Router) — no Pages Router, no separate Express/Node backend
- **Styling:** Tailwind CSS only — no styled-components, no CSS modules, no Bootstrap, no MUI
- **Charts:** Recharts — no Chart.js, no D3 unless explicitly requested
- **AI Agent calls:** Groq SDK (`groq-sdk`) — no OpenAI SDK, no LangChain, no other agent framework unless explicitly requested
- **Data layer:** Neural Pulse API only — do NOT introduce Supabase, Firebase, Prisma, MongoDB, or any other database/ORM. Neural Pulse is the single source of truth for all persisted data.
- **Deployment target:** Vercel — do not write code that assumes a separate backend host, Docker, or a VM
- **State management:** React's built-in `useState`/`useReducer`/Context only — no Redux, no Zustand, unless explicitly requested
- **HTTP calls:** native `fetch` — no axios unless explicitly requested

### Explicitly avoid
- Do not add authentication/multi-tenant systems (NextAuth, Clerk, Auth0) — out of scope for this MVP
- Do not add a separate backend server, message queue, or websocket server
- Do not add payment processing (Stripe, etc.)
- Do not add testing frameworks unless explicitly asked — this is a hackathon build, prioritize working demo over test coverage
- Do not install any package not already listed in `techstack.md` without flagging it first

---

## 2. What the AI Should Do

- Always check `architecture.md` for the correct file/folder location before creating a new file
- Always check `agents.md` before writing or modifying anything related to the AI agent's reasoning, prompts, or decision schema
- Keep all agent decision outputs in the exact JSON shape defined in `agents.md` — do not invent new fields without updating that file too
- Wrap every external API call (Groq, Neural Pulse) in try/catch, and apply the fallback/retry rules defined in `agents.md` §Error Handling
- Use polling (not websockets/SSE) for any "live" or "real-time" UI behavior
- Keep components small and colocated by feature (see `architecture.md` folder structure)
- Write clear, minimal comments only where logic is non-obvious (e.g. decision fallback logic) — do not over-comment simple UI code
- When unsure whether a feature is in scope, check `phases.md` — if it's not listed in the current phase, do not build it yet
- Prefer editing existing files over creating new ones when a feature clearly belongs in an existing component/route

## 3. What the AI Should NOT Do

- Do not silently swap Groq for another provider or Neural Pulse for another database, even if "easier" — this breaks hackathon bonus eligibility
- Do not fabricate Neural Pulse API methods that aren't in its documented SDK (`chat`, `insert`, `bulkInsert`, `update`, `upsert`, `delete`, `bulkDelete`, `select`, `count`, `listTables`, `getSchema`, `createSchema`, `dropTable`, `analytics`, `generateSdk`, `raw`)
- Do not execute an agent "action" (auto-resolve, follow-up, escalate) without first validating the AI's structured output against the schema in `agents.md`
- Do not add real email-sending, real SMS, or real third-party CRM integrations — everything is simulated/mocked for this MVP (see `phases.md` Out of Scope)
- Do not remove or bypass the low-confidence fallback-to-escalate rule, even to "simplify" the demo
- Do not hardcode API keys in source files — always read from environment variables (`GROQ_API_KEY`, `NEURAL_PULSE_API_KEY`, `NEURAL_PULSE_BASE_URL`)
- Do not restructure the folder layout defined in `architecture.md` without updating that file first
- Do not skip error states in the UI — every data-fetching component must handle loading, empty, and error states

---

## 4. Code Style

- TypeScript preferred over plain JS where the project already uses `.tsx`/`.ts`
- Functional React components only, no class components
- Keep API route handlers thin — push business logic (classification, validation, fallback) into a shared `lib/agent/` module so it's reusable and testable
- Naming: `camelCase` for variables/functions, `PascalCase` for components, `kebab-case` for file names except component files (`PascalCase.tsx`)

---

## 5. When in Doubt

If a request is ambiguous or not covered by `phases.md`, the AI should:
1. Default to the smallest, MVP-consistent implementation
2. Flag the ambiguity in its response rather than guessing silently
3. Never introduce a new external dependency without stating it out loud first
