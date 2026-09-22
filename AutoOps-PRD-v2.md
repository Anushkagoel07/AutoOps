# AutoOps — Product Requirements Document (v2)

**Prepared for:** Evorozen Hackathon Submission
**Version:** 2.0 (Refined & Merged)
**Date:** September 2026

---

## 1. Product Overview

**AutoOps** is an autonomous AI SaaS agent that handles customer support tickets and sales leads with minimal human intervention. The agent analyzes incoming requests, classifies them, makes a decision, executes the appropriate action, and records every decision for transparency and analytics.

Unlike a chatbot, AutoOps doesn't just reply — it **decides**: resolve it, follow up on it, escalate it, or reject it as spam, and explains *why*.

---

## 2. Objective

Build a working SaaS prototype that demonstrates:

- Autonomous ticket/lead classification
- AI-based priority and decision-making with confidence scoring
- Automatic actions (reply, follow-up, escalate, reject)
- Human escalation when required
- Neural Pulse as the primary data/processing/analytics layer
- Real-time (polled) agent activity visibility
- A credible, presentable Go-To-Market story

---

## 3. Target Users & GTM Strategy

### Target Customer
Small businesses, solo founders, and early-stage startups (5–50 employees) who don't have a dedicated support or sales ops hire, and growing SaaS teams that want to automate first-line triage before scaling a human team.

### Value Proposition
Replace the first 60–70% of repetitive ticket/lead handling — the simple, high-volume, low-judgment cases — with an autonomous agent, freeing humans to focus only on complex or high-value work.

### Acquisition Channel
- Direct outreach to indie SaaS founders/communities (Indie Hackers, X/Twitter build-in-public, Product Hunt launch)
- Build-in-public documentation during the hackathon sprint itself (per Evorozen's Marketing Protocol) to generate early interest and real test users

### Pricing Logic (conceptual, for pitch)
Per-resolved-request or per-seat pricing, positioned as cheaper than hiring a part-time support/sales ops person.

### Traction Proof for Judges
Live deployed link with seeded demo data showing agent decisions in real time. If time allows, invite a small number of real test users during the sprint to generate genuine analytics for the "verifiable live users" bonus.

---

## 4. Core User Flow

```text
Ticket / Lead
      |
   Intake
      |
   AI Agent
      |
Classify + Prioritize + Confidence Score
      |
   Decision
  /    |    \        \
Resolve Follow-up Escalate Reject(Spam)
  |      |         |          |
 Reply  Email   Human Queue  Archive
      \      |      /
         Neural Pulse
              |
          Analytics
```

---

## 5. Functional Requirements

### 5.1 Intake

The system must support:
- Manual ticket/lead creation through the UI
- CSV upload
- A simulated webhook endpoint (for demo purposes — fires sample requests on a timer or button click)

**Required fields:**
```text
id, name, email, message, type, created_at
```
`type`: `support_ticket` | `sales_lead`

---

### 5.2 AI Agent

Every incoming request is processed by the agent, which must determine:
```text
category, priority, confidence, decision, reason, action
```

**Support categories:** Billing · Technical · Account · General · Spam
**Sales categories:** Qualified Lead · Potential Lead · Low Intent · Spam
**Priority:** Low · Medium · High · Critical
**Decisions:** `auto_resolve` · `follow_up` · `escalate` · `reject`

---

## 6. Autonomous Actions

### 6.1 Auto Resolve
For simple, high-confidence requests: generate a reply → mark resolved → record action → store in Neural Pulse.

### 6.2 Sales Follow-up
For qualified leads: generate a personalized follow-up → assign a lead score → mark as sent (simulated) → record → store in Neural Pulse.

### 6.3 Escalation
For complex, critical, or low-confidence requests: create a human task → generate a concise summary → suggest a next action → mark as escalated → record reason.

### 6.4 Spam
Classify as spam → reject/archive → exclude from active workload → **still counted in analytics** so judges can see the agent is catching and filtering noise, not just processing "easy" tickets.

---

## 7. Agent Decision Output

The AI must return structured JSON:

```json
{
  "category": "billing",
  "priority": "high",
  "confidence": 0.94,
  "decision": "escalate",
  "reason": "Possible duplicate payment",
  "action": "create_human_task"
}
```

The backend must **validate** this output (correct fields, valid enum values, confidence between 0–1) before executing any action.

**Fallback rule (new):** If AI output fails validation, or confidence is below a set threshold (e.g. 0.5), the system must default to `escalate` rather than silently failing or guessing. This is logged as `"reason": "Low confidence / validation failure — routed to human review"`. This guarantees the demo never breaks mid-pitch on a bad AI response.

**Retry rule (new):** On a raw API failure (not a bad output, but no response — e.g. rate limit or timeout) from Groq, retry once after a short delay; if it fails again, route to escalate with reason `"AI service unavailable — routed to human review"`.

---

## 8. Agent Activity Log

Every agent decision generates an activity record:
```text
timestamp, request_id, category, priority, decision, reason, action, status
```

Displayed in chronological order on the dashboard, e.g.:
```text
Ticket #1042
Billing · High
Decision: Escalate
Reason: Possible duplicate payment
Action: Human task created
```

---

## 9. Neural Pulse Integration

Neural Pulse is the **primary data and processing layer**. It is used to store/query:
- Incoming requests, AI classifications, decisions, actions, resolution status, escalations, lead information, analytics data

**Schema setup (new):** Initial tables (`requests`, `agent_activity`, `escalations`, `leads`) should be created using Neural Pulse's `chat()` / `createSchema()` plain-English capability rather than hardcoded schema calls — this demonstrates deeper use of Neural Pulse's natural-language layer, not just CRUD, which is directly relevant to the bonus multiplier criteria.

### 9.1 Natural Language Analytics ("Ask Neural Pulse")
Dashboard provides a text input where a user can ask, e.g.:
```text
How many billing tickets did we receive this week?
How many tickets were automatically resolved?
How many leads were followed up?
What percentage of requests were escalated?
Which category has the highest ticket volume?
How many spam requests were filtered out?
```
Queries route through Neural Pulse's `analytics()` method and return a human-readable answer plus, where possible, a simple chart.

---

## 10. Dashboard

### 10.1 Overview
Total requests · Auto-resolved · Follow-ups · Escalations · Resolution rate · Spam filtered

### 10.2 Live Activity
Recent agent actions, polled every few seconds (see §13 — no websockets needed for MVP). Each entry shows request, category, priority, decision, reason, action.

### 10.3 Request Feed
Filters: All · Support · Sales · Billing · Technical · Escalated · Resolved

### 10.4 Analytics
Charts: requests over time · requests by category · resolution vs. escalation · sales lead conversion/follow-up status · spam filtered over time

### 10.5 Ask Neural Pulse
Text input · submit button · AI-generated answer · query history

### 10.6 Human Escalation Queue
Each item shows: request · priority · AI summary · reason for escalation · suggested next action · timestamp. Status: Pending → In Progress → Resolved.

---

## 11. Backend Architecture (simplified — new)

**Original two-service design (separate Node/Express backend) is replaced with a single Next.js deployment** to reduce hackathon-week risk: one repo, one Vercel deployment, no separate hosting/env-variable setup to manage or debug under time pressure.

- **Frontend + Backend:** Next.js (App Router), using **Next.js API routes / Route Handlers** as serverless backend functions
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Agent Brain:** Groq API (Llama 3.3/4 or similar, with function/tool calling for structured decisions)
- **Data & Analytics Layer:** Neural Pulse API
- **Deployment:** Vercel (single live URL for both frontend and API)

### API Routes
```http
POST /api/requests
POST /api/requests/upload
POST /api/webhooks/request        (simulated)

GET  /api/requests
GET  /api/requests/:id

POST /api/agent/process/:id
POST /api/actions/:id/execute

GET   /api/escalations
PATCH /api/escalations/:id

POST /api/analytics/query
GET  /api/analytics/summary
```

---

## 12. Data Model

**Request**
```text
id, type, name, email, message, category, priority, confidence,
decision, reason, action, status, created_at, updated_at
```

**Agent Activity**
```text
id, request_id, decision, reason, action, status, created_at
```

**Escalation**
```text
id, request_id, summary, reason, suggested_action, status, created_at
```

**Lead**
```text
id, request_id, lead_score, follow_up_status, created_at
```

---

## 13. Real-Time Updates (clarified — new)

For the MVP, use **simple polling** (dashboard re-fetches `/api/requests` and `/api/analytics/summary` every 3–5 seconds). Websockets/SSE are unnecessary complexity for a hackathon timeline and add deployment risk — polling is sufficient to *look* real-time in a live demo.

---

## 14. Rate Limits & API Failure Handling (new)

- **Groq free tier:** implement basic request queuing/backoff if rate limits are hit during demo seeding; process seed data in small batches rather than firing all requests at once.
- **Neural Pulse:** wrap all calls in try/catch; on failure, show a non-blocking UI error state rather than crashing the dashboard.
- Both failure paths funnel into the fallback/retry rule described in §7, so a live demo degrades gracefully instead of breaking.

---

## 15. AI Agent Requirements

The agent must:
1. Analyze the incoming request
2. Classify it
3. Assign priority
4. Determine confidence
5. Select an action
6. Explain the decision
7. Execute the appropriate workflow
8. Record the result

The agent must **not** execute an action when its output fails validation — it must fall back per the rule in §7.

---

## 16. Demo Scenarios

**1 — Support (billing, urgent)**
`"My card was charged twice for the same subscription."` → Billing · High · Escalate · Human task created

**2 — Support (simple)**
`"How can I reset my password?"` → Account · Low · Auto-resolve · Reply generated

**3 — Sales (qualified)**
`"We are a 50-person company looking for your enterprise plan."` → Qualified Lead · High · Follow-up · Personalized email generated

**4 — Spam**
`"WIN FREE MONEY!!!"` → Spam · Low · Reject

---

## 17. Success Criteria

The prototype is complete when:
- A request can enter the system and is processed automatically by the AI
- AI produces a structured, validated decision (with fallback handling working)
- The selected action executes automatically
- Every decision appears in the activity log
- Escalations appear in the human queue
- Sales leads receive generated follow-ups
- Data is stored/queryable through Neural Pulse (including schema created via `chat()`)
- Natural-language analytics work through Neural Pulse
- Dashboard displays live/recent activity via polling
- The full workflow can be demoed end-to-end without manually editing database records
- A clear GTM narrative is ready for the pitch video

---

## 18. Deployment

**Single deployment:** Vercel (Next.js frontend + API routes together)

**Required environment variables:**
```text
GROQ_API_KEY
NEURAL_PULSE_API_KEY
NEURAL_PULSE_BASE_URL
```

---

## 19. Build Timeline (new)

| Day | Focus |
|---|---|
| Day 1 | Scaffold Next.js + Tailwind; get Groq + Neural Pulse keys working; create schema via Neural Pulse `chat()`; build intake form |
| Day 2 | Build agent reasoning pipeline (Groq function calling) + validation/fallback logic; build activity log + escalation queue UI |
| Day 3 | Build analytics (`Ask Neural Pulse`) + charts; polish dashboard UI; seed demo data; test all 4 demo scenarios end-to-end |
| Final day | Deploy to Vercel; record pitch video (include GTM slide); build-in-public post on X/LinkedIn tagging Evorozen |

---

## 20. Out of Scope (Hackathon MVP)

- Real Gmail/email sending integration
- Real CRM integrations
- Real payment processing
- Complex user permissions / multi-tenant billing
- Mobile application
- Advanced enterprise administration
- Large-scale production infrastructure
- Websockets/SSE (polling is sufficient — see §13)

---

*End of PRD v2.*
