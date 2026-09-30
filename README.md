# 🤖 AutoOps

### **AI that reads. Thinks. Decides. Acts.**

AutoOps is an **AI-powered autonomous operations platform** designed to automate customer support and sales workflows.

Instead of simply generating replies, AutoOps understands incoming requests, classifies them, evaluates their priority and confidence, and decides what should happen next — **resolve, follow up, escalate, or reject.**

> **Less manual work. Faster decisions. Smarter operations.**

---

## 🚀 What is AutoOps?

Businesses receive hundreds of support requests and sales inquiries that require repetitive manual processing.

AutoOps introduces an AI agent that can:

* 🧠 Understand incoming requests
* 🏷️ Classify support and sales intent
* ⚡ Determine priority
* 🎯 Calculate AI confidence
* 🤝 Decide the next action
* 💬 Generate appropriate responses
* 🚨 Escalate sensitive or uncertain cases
* 📈 Track leads and operational activity
* 📊 Provide AI-powered analytics

---

## ✨ Core Features

### 🧠 Autonomous AI Agent

Every incoming request is analyzed using structured AI reasoning.

The agent determines:

| Field      | Description                                              |
| ---------- | -------------------------------------------------------- |
| Category   | Billing, Technical, Account, General, Spam, Sales Intent |
| Priority   | Low, Medium, High, Critical                              |
| Confidence | AI confidence score                                      |
| Decision   | Resolve, Follow Up, Escalate, Reject                     |
| Reason     | Explainable reasoning                                    |
| Action     | Action taken by the system                               |

---

### ⚡ Intelligent Decisions

AutoOps can automatically:

**✅ Auto Resolve**
Handle simple, low-risk support questions.

**📩 Follow Up**
Identify genuine sales opportunities and initiate a simulated follow-up.

**🚨 Escalate**
Route sensitive, uncertain, or high-risk requests to a human.

**🗑️ Reject**
Identify and archive obvious spam.

---

## 🎯 Demo Scenarios

AutoOps is built around realistic business scenarios:

### 💳 Duplicate Billing

> "My card was charged twice for the same subscription."

**Result:**
`Billing → High → Escalate`

---

### 🔐 Password Reset

> "How can I reset my password?"

**Result:**
`Account → Low → Auto Resolve`

---

### 🏢 Enterprise Lead

> "We are a 50-person company looking for your enterprise plan."

**Result:**
`Qualified Lead → High → Follow Up`

---

### 🚫 Spam

> "WIN FREE MONEY!!!"

**Result:**
`Spam → Low → Reject`

---

## 📊 Dashboard

AutoOps provides an operations dashboard for monitoring AI-driven workflows.

### Operations Overview

* Total requests
* Pending requests
* Resolved requests
* Escalated requests
* Live activity
* Decision distribution
* Human escalation queue

### Analytics

* Request trends
* Decision breakdown
* Operational insights
* Natural-language analytics

---

## 🧠 Ask Neural Pulse

AutoOps includes a natural-language analytics layer powered by **Neural Pulse**.

Instead of manually filtering data, users can ask questions such as:

> **"How many requests were escalated today?"**

or

> **"Which category generates the most support requests?"**

The analytics layer converts operational data into useful insights.

---

## 🔄 How AutoOps Works

```text
             Incoming Request
                    │
                    ▼
              ┌───────────┐
              │   Intake  │
              └─────┬─────┘
                    │
                    ▼
             ┌─────────────┐
             │  AI Agent   │
             │    Groq     │
             └──────┬──────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
     Resolve     Follow Up   Escalate
        │           │           │
        └───────────┼───────────┘
                    │
                    ▼
              ┌───────────┐
              │ Analytics │
              └───────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Recharts**

### AI

* **Groq**
* Function Calling / Structured AI Output

### Data & Analytics

* **Neural Pulse**
* Local JSON storage for the current demo fallback

### Deployment

* **Vercel**

---

## 📂 Project Structure

```text
AutoOps/
│
├── app/
│   ├── api/
│   │   ├── actions/
│   │   ├── agent/
│   │   ├── analytics/
│   │   └── requests/
│   │
│   └── dashboard/
│       ├── analytics/
│       ├── escalations/
│       └── intake/
│
├── components/
│   ├── AnalyticsCharts
│   ├── AskNeuralPulse
│   ├── EscalationQueue
│   └── LiveActivityFeed
│
├── lib/
│   ├── agent/
│   ├── neuralpulse/
│   └── store.ts
│
├── data/
│   └── autoops.json
│
├── public/
│
├── AGENTS.md
├── CLAUDE.md
├── architecture.md
├── AutoOps-PRD-v2.md
└── README.md
```

---

## 🔌 API Routes

| Endpoint                        | Purpose                                  |
| ------------------------------- | ---------------------------------------- |
| `POST /api/requests`            | Create a request                         |
| `POST /api/requests/upload`     | Upload requests through CSV              |
| `GET /api/requests`             | Fetch requests                           |
| `POST /api/agent/process/:id`   | Process request with AI                  |
| `POST /api/actions/:id/execute` | Execute selected action                  |
| `GET /api/escalations`          | Fetch escalations                        |
| `PATCH /api/escalations/:id`    | Update escalation                        |
| `GET /api/analytics/summary`    | Fetch analytics summary                  |
| `POST /api/analytics/query`     | Ask natural-language analytics questions |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Anushkagoel07/AutoOps.git
cd AutoOps
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key
NEURAL_PULSE_API_KEY=your_neural_pulse_api_key
NEURAL_PULSE_BASE_URL=your_neural_pulse_base_url
```

### 4. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔐 Security

API keys should be stored only in environment variables.

Do **not** commit `.env.local` or expose API keys in client-side code.

---

## 🧪 Testing the Demo

Try these four requests:

```text
1. My card was charged twice for the same subscription.

2. How can I reset my password?

3. We are a 50-person company looking for your enterprise plan.

4. WIN FREE MONEY!!!
```

Then open the dashboard and observe how the AI processes each request.

---

## 🎯 Project Goals

AutoOps focuses on demonstrating how AI can move beyond simple chatbot interactions into **autonomous operational decision-making**.

The system combines:

**LLM Reasoning + Structured Decisions + Automated Actions + Human Escalation + Analytics**

to create an end-to-end AI operations workflow.

---

## 🔮 Future Scope

Potential future extensions include:

* Real email integration
* CRM integrations
* Slack / Teams notifications
* Multi-tenant workspaces
* Advanced lead scoring
* Human-in-the-loop workflows
* More AI agents for specialized operations
* Production-grade persistent data infrastructure
* Advanced analytics and reporting

---

## 🏆 Hackathon Project

AutoOps was built as an AI-first automation platform demonstrating how autonomous agents can handle repetitive **support and sales operations** while keeping humans in the loop for sensitive decisions.

### **AI that doesn't just answer — it takes action.** 🚀

---

## 👩‍💻 Author

**Anushka Goel**

GitHub: [@Anushkagoel07](https://github.com/Anushkagoel07)

---

## ⭐ If you like the project

Give the repository a ⭐ and feel free to explore the code!
