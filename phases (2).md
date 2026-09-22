# phases.md — AutoOps Build Phases

This file defines what to build, in what order. Nothing outside the current phase's scope should be built until earlier phases are complete. If asked to build something not listed here, check against `phases.md` first — if it's not listed anywhere, it's out of scope for the hackathon (see §6).

---

## Phase 0 — Setup (Day 1, first few hours)

- [ ] Initialize Next.js (TypeScript, App Router, Tailwind) project
- [ ] Set up folder structure per `architecture.md`
- [ ] Add `.env.local` with `GROQ_API_KEY`, `NEURAL_PULSE_API_KEY`, `NEURAL_PULSE_BASE_URL`
- [ ] Confirm Groq API key works with a simple test call
- [ ] Confirm Neural Pulse API key works with a simple test call
- [ ] Create Neural Pulse schema (`requests`, `agent_activity`, `escalations`, `leads`) via `chat()`/`createSchema()`
- [ ] Push initial commit to GitHub, connect repo to Vercel for continuous deploy

**Exit criteria:** Empty Next.js app deployed and live on Vercel, both API keys verified working.

---

## Phase 1 — Intake (Day 1)

- [ ] Build `IntakeForm.tsx` (manual entry: name, email, message, type)
- [ ] Build `POST /api/requests` route → stores request in Neural Pulse with status `pending`
- [ ] Build CSV upload form + `POST /api/requests/upload` route (bulk insert)
- [ ] Build simulated webhook button + `POST /api/webhooks/request` route (fires one of the sample demo messages from `phases.md` §5)
- [ ] Build `GET /api/requests` and `GET /api/requests/:id`

**Exit criteria:** A request can be created via all three intake methods and appears in Neural Pulse.

---

## Phase 2 — Agent Core (Day 1–2)

- [ ] Write `lib/agent/prompt.ts` — system prompt + few-shot examples (see `agents.md`)
- [ ] Write `lib/agent/schema.ts` — Zod schema matching `agents.md` §5
- [ ] Write `lib/agent/classify.ts` — calls Groq with function calling, returns validated decision
- [ ] Write `lib/agent/fallback.ts` — implements all rules in `agents.md` §7 (validation failure, low confidence, API failure)
- [ ] Build `POST /api/agent/process/:id` route — runs the full classify → validate → fallback pipeline
- [ ] Write agent decision + reasoning to `agent_activity` table in Neural Pulse

**Exit criteria:** Submitting any of the 4 demo scenario messages produces the exact expected category/priority/decision from `phases.md` §5, and a malformed/low-confidence case correctly falls back to escalate.

---

## Phase 3 — Actions & Escalation (Day 2)

- [ ] Build `POST /api/actions/:id/execute` — executes based on `decision`:
  - `auto_resolve` → mark resolved, store `draft_content` as the reply
  - `follow_up` → create/update `leads` record with `lead_score`, mark follow-up as sent (simulated)
  - `escalate` → create `escalations` record with summary + suggested action
  - `reject` → mark archived
- [ ] Build `GET /api/escalations` and `PATCH /api/escalations/:id` (status: Pending → In Progress → Resolved)
- [ ] Build `EscalationQueue.tsx` UI component

**Exit criteria:** All four decision paths correctly update Neural Pulse and are reflected in the UI.

---

## Phase 4 — Dashboard (Day 2)

- [ ] Build `OverviewStats.tsx` (total requests, auto-resolved, follow-ups, escalations, resolution rate, spam filtered)
- [ ] Build `LiveActivityFeed.tsx` with polling hook (`usePolling`, 3–5s interval)
- [ ] Build `RequestFeed.tsx` with filters (All / Support / Sales / Billing / Technical / Escalated / Resolved)
- [ ] Wire up loading/empty/error states on every data-fetching component (per `rules.md` and `architecture.md`)

**Exit criteria:** Dashboard reflects live state of the system as requests are processed, with no unhandled loading/error states.

---

## Phase 5 — Analytics & Ask Neural Pulse (Day 2–3)

- [ ] Build `GET /api/analytics/summary` (aggregate counts for `OverviewStats`)
- [ ] Build `POST /api/analytics/query` → forwards to Neural Pulse `analytics()`
- [ ] Build `AnalyticsCharts.tsx` (requests over time, by category, resolution vs escalation, lead conversion)
- [ ] Build `AskNeuralPulse.tsx` (text input, submit, answer display, query history)

**Exit criteria:** All sample analytics questions in `architecture.md` §9.1 (from the PRD) return correct, human-readable answers.

---

## Phase 6 — Polish, Seed Data & Demo Prep (Day 3)

- [ ] Seed realistic demo data covering all 4 demo scenarios plus extra variety (10–20 requests total)
- [ ] Visual polish pass — consistent spacing, color system, empty states, loading skeletons
- [ ] Full end-to-end run-through with no manual database edits
- [ ] Test rate-limit/failure fallback paths at least once deliberately (kill network briefly, confirm graceful escalate fallback)

**Exit criteria:** The full demo can be run live, start to finish, without needing to touch Neural Pulse or Groq consoles manually.

---

## Phase 7 — Deploy, Pitch & Submission (Final day)

- [ ] Final deploy to Vercel, confirm live link works cleanly from a fresh browser session
- [ ] Record pitch video: problem → solution → live demo of all 4 scenarios → GTM slide (from PRD v2 §3) → tech stack/Neural Pulse usage callout
- [ ] Post build-in-public update on X/LinkedIn tagging Evorozen (Marketing Protocol bonus)
- [ ] Submit repo + live link + pitch video per hackathon submission instructions

**Exit criteria:** Submission complete before deadline.

---

## Demo Scenarios Reference (used across Phases 2 and 6)

1. **Support/Billing/Urgent:** `"My card was charged twice for the same subscription."` → Billing · High · Escalate
2. **Support/Simple:** `"How can I reset my password?"` → Account · Low · Auto-resolve
3. **Sales/Qualified:** `"We are a 50-person company looking for your enterprise plan."` → Qualified Lead · High · Follow-up
4. **Spam:** `"WIN FREE MONEY!!!"` → Spam · Low · Reject

---

## 6. Explicitly Out of Scope (all phases)

- Real email/SMS sending
- Real CRM integrations
- Real payment processing
- Authentication / multi-tenant billing
- Mobile app
- Websockets/SSE
- Automated test suite

If a request falls into this list, do not build it — flag it as out of scope instead.
