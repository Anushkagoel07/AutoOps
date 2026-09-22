# architecture.md — AutoOps System Architecture

## 1. High-Level Architecture

```
┌───────────────────────────────────────────────┐
│                Next.js App (Vercel)             │
│                                                   │
│  ┌───────────────┐        ┌───────────────────┐ │
│  │  Frontend       │        │  API Routes         │ │
│  │  (App Router     │ <---> │  (Route Handlers,    │ │
│  │  pages + UI)     │  fetch │  serverless funcs)  │ │
│  └───────────────┘        └─────────┬─────────┘ │
└──────────────────────────────────────┼───────────┘
                                        │
                     ┌──────────────────┼──────────────────┐
                     ▼                                      ▼
            ┌────────────────┐                   ┌────────────────────┐
            │   Groq API       │                   │   Neural Pulse API   │
            │ (agent reasoning, │                   │ (data storage,       │
            │  function calling)│                   │  retrieval, analytics)│
            └────────────────┘                   └────────────────────┘
```

Everything runs inside a **single Next.js deployment**. There is no separate backend service — API routes act as the backend. This keeps the hackathon build to one repo and one deploy target.

---

## 2. Request Lifecycle (End-to-End Flow)

1. User submits a ticket/lead via the intake form (or CSV upload, or the simulated webhook button).
2. Frontend calls `POST /api/requests` → request is stored in Neural Pulse with status `pending`.
3. Frontend (or the same API call) triggers `POST /api/agent/process/:id`.
4. That route:
   a. Fetches the request from Neural Pulse.
   b. Builds a prompt and calls Groq with function calling, asking for the structured decision object (see `agents.md`).
   c. Validates the returned JSON against the expected schema.
   d. If invalid or low-confidence → overrides decision to `escalate` (fallback rule).
   e. Calls `POST /api/actions/:id/execute` internally (or directly executes) based on the decision.
   f. Writes the agent's decision + reasoning to Neural Pulse as an `agent_activity` record.
   g. If decision is `escalate` → also writes an `escalation` record.
   h. If type is `sales_lead` and decision is `follow_up` → also writes/updates a `lead` record.
5. Dashboard polls `GET /api/requests` and `GET /api/analytics/summary` every few seconds to reflect new activity.
6. "Ask Neural Pulse" input sends a natural-language question to `POST /api/analytics/query`, which forwards it to Neural Pulse's `analytics()` method and returns a formatted answer.

---

## 3. Folder Structure

```
autoops/
├── app/
│   ├── page.tsx                     # Dashboard overview (landing page after load)
│   ├── layout.tsx                   # Root layout, global styles, fonts
│   ├── globals.css                  # Tailwind base styles
│   │
│   ├── dashboard/
│   │   ├── page.tsx                 # Main dashboard (overview + live activity)
│   │   ├── requests/
│   │   │   └── page.tsx             # Request feed with filters
│   │   ├── escalations/
│   │   │   └── page.tsx             # Human escalation queue
│   │   ├── analytics/
│   │   │   └── page.tsx             # Charts + "Ask Neural Pulse"
│   │   └── intake/
│   │       └── page.tsx             # Manual entry + CSV upload form
│   │
│   └── api/
│       ├── requests/
│       │   ├── route.ts             # GET (list), POST (create)
│       │   ├── [id]/route.ts        # GET single request
│       │   └── upload/route.ts      # POST CSV upload
│       ├── webhooks/
│       │   └── request/route.ts     # POST simulated webhook intake
│       ├── agent/
│       │   └── process/[id]/route.ts # POST — run the agent on a request
│       ├── actions/
│       │   └── [id]/execute/route.ts # POST — execute a decided action
│       ├── escalations/
│       │   ├── route.ts             # GET list
│       │   └── [id]/route.ts        # PATCH status update
│       └── analytics/
│           ├── query/route.ts       # POST natural-language question
│           └── summary/route.ts     # GET overview numbers
│
├── components/
│   ├── ui/                          # Small reusable UI pieces (Button, Card, Badge, etc.)
│   ├── dashboard/
│   │   ├── OverviewStats.tsx
│   │   ├── LiveActivityFeed.tsx
│   │   ├── RequestFeed.tsx
│   │   ├── EscalationQueue.tsx
│   │   ├── AnalyticsCharts.tsx
│   │   └── AskNeuralPulse.tsx
│   └── intake/
│       ├── IntakeForm.tsx
│       └── CsvUploadForm.tsx
│
├── lib/
│   ├── agent/
│   │   ├── prompt.ts                # Prompt template + system instructions for Groq
│   │   ├── schema.ts                # Zod (or manual) schema for validating agent output
│   │   ├── classify.ts              # Core function: request -> Groq call -> validated decision
│   │   └── fallback.ts              # Fallback/retry logic (low confidence, API failure)
│   ├── neuralpulse/
│   │   ├── client.ts                # Neural Pulse SDK wrapper/init
│   │   ├── requests.ts              # insert/select/update helpers for `requests` table
│   │   ├── activity.ts              # helpers for `agent_activity` table
│   │   ├── escalations.ts           # helpers for `escalations` table
│   │   ├── leads.ts                 # helpers for `leads` table
│   │   └── schema-setup.ts          # one-time schema creation via chat()/createSchema()
│   └── utils.ts                     # generic helpers (formatting, date utils, etc.)
│
├── types/
│   └── index.ts                     # Shared TypeScript types (Request, Decision, Escalation, Lead)
│
├── public/
│   └── (icons, favicon, demo CSV sample)
│
├── .env.local                       # GROQ_API_KEY, NEURAL_PULSE_API_KEY, NEURAL_PULSE_BASE_URL
├── rules.md
├── architecture.md
├── agents.md
├── techstack.md
├── phases.md
├── tailwind.config.ts
├── next.config.js
├── package.json
└── README.md
```

---

## 4. Data Flow Between Layers

- **UI components** never call Groq or Neural Pulse directly — they only call internal `/api/*` routes.
- **API routes** are the only layer allowed to call `lib/agent/*` and `lib/neuralpulse/*`.
- **`lib/agent/*`** is the only layer allowed to call Groq.
- **`lib/neuralpulse/*`** is the only layer allowed to call the Neural Pulse SDK.

This keeps a clean boundary: if Groq or Neural Pulse's API shape changes, only one file needs to change, not every page.

---

## 5. Polling Strategy

- Dashboard components use a simple `setInterval`-based fetch (every 3–5 seconds) wrapped in a custom hook, e.g. `usePolling(fetchFn, intervalMs)`.
- No websockets, no SSE — kept deliberately simple for hackathon reliability (see `rules.md`).

---

## 6. Error Boundaries

- Every page under `app/dashboard/*` wraps its data-fetching in loading/error/empty states.
- API routes return consistent error shapes: `{ error: string, code: string }` with appropriate HTTP status codes.
- Agent failures never throw uncaught — they resolve to the fallback escalate path (see `agents.md`).
