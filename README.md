<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,50:8B5CF6,100:EC4899&height=230&section=header&text=AutoOps&fontSize=72&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=AI%20that%20reads.%20Thinks.%20Decides.%20Acts.&descAlignY=60&descSize=20" alt="AutoOps banner" width="100%"/>

<a href="https://github.com/Anushkagoel07/AutoOps">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1200&color=8B5CF6&center=true&vCenter=true&width=700&lines=Resolve+%E2%9C%85+%7C+Follow+Up+%F0%9F%93%A9+%7C+Escalate+%F0%9F%9A%A8+%7C+Reject+%F0%9F%97%91%EF%B8%8F;Autonomous+support+%26+sales+operations;Humans+stay+in+the+loop+for+risky+cases" alt="Typing animation"/>
</a>

<br/>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

![Status](https://img.shields.io/badge/status-hackathon_project-EC4899?style=flat-square)
![AI](https://img.shields.io/badge/AI-autonomous_agent-8B5CF6?style=flat-square)
![Human in the loop](https://img.shields.io/badge/human-in_the_loop-10B981?style=flat-square)

### 🤖 **Less manual work. Faster decisions. Smarter operations.**

[🚀 Quick Start](#-getting-started) •
[✨ Features](#-core-features) •
[🎯 Demo](#-demo-scenarios) •
[📊 Dashboard](#-dashboard) •
[🔌 API](#-api-routes)

</div>

---

## 🚀 What is AutoOps?

Businesses receive hundreds of support requests and sales inquiries that need repetitive manual processing.

**AutoOps** is an **AI-powered autonomous operations platform** that does more than generate replies. It understands each incoming request, classifies it, evaluates priority and confidence, and then **decides what should happen next**: resolve, follow up, escalate, or reject.

<table>
<tr>
<td>🧠 Understand requests</td>
<td>🏷️ Classify support & sales intent</td>
<td>⚡ Determine priority</td>
</tr>
<tr>
<td>🎯 Calculate AI confidence</td>
<td>🤝 Decide the next action</td>
<td>💬 Generate responses</td>
</tr>
<tr>
<td>🚨 Escalate risky cases</td>
<td>📈 Track leads & activity</td>
<td>📊 AI-powered analytics</td>
</tr>
</table>

---

## ✨ Core Features

### 🧠 Autonomous AI Agent

Every request is analyzed with structured AI reasoning. The agent produces:

| 🔑 Field | 📝 Description |
| :-- | :-- |
| 🏷️ **Category** | Billing, Technical, Account, General, Spam, Sales Intent |
| ⚡ **Priority** | 🟢 Low · 🟡 Medium · 🟠 High · 🔴 Critical |
| 🎯 **Confidence** | AI confidence score |
| 🤝 **Decision** | Resolve, Follow Up, Escalate, Reject |
| 💡 **Reason** | Explainable reasoning behind the decision |
| ⚙️ **Action** | The action taken by the system |

### ⚡ Intelligent Decisions

| | Decision | What happens |
| :-: | :-- | :-- |
| ✅ | **Auto Resolve** | Handles simple, low-risk support questions |
| 📩 | **Follow Up** | Spots genuine sales opportunities and starts a simulated follow-up |
| 🚨 | **Escalate** | Routes sensitive, uncertain, or high-risk requests to a human |
| 🗑️ | **Reject** | Identifies and archives obvious spam |

---

## 🎯 Demo Scenarios

AutoOps is built around realistic business situations.

| | Scenario | Incoming message | Result |
| :-: | :-- | :-- | :-- |
| 💳 | **Duplicate Billing** | *"My card was charged twice for the same subscription."* | `Billing` → 🟠 `High` → 🚨 **Escalate** |
| 🔐 | **Password Reset** | *"How can I reset my password?"* | `Account` → 🟢 `Low` → ✅ **Auto Resolve** |
| 🏢 | **Enterprise Lead** | *"We are a 50-person company looking for your enterprise plan."* | `Qualified Lead` → 🟠 `High` → 📩 **Follow Up** |
| 🚫 | **Spam** | *"WIN FREE MONEY!!!"* | `Spam` → 🟢 `Low` → 🗑️ **Reject** |

---

## 📊 Dashboard

An operations dashboard for monitoring AI-driven workflows.

**📌 Operations Overview**

- 📥 Total requests
- ⏳ Pending requests
- ✅ Resolved requests
- 🚨 Escalated requests
- 🔴 Live activity feed
- 🥧 Decision distribution
- 🧑‍💼 Human escalation queue

**📈 Analytics**

- 📉 Request trends
- 🍰 Decision breakdown
- 🔍 Operational insights
- 💬 Natural-language analytics

---

## 🧠 Ask Neural Pulse

A natural-language analytics layer powered by **Neural Pulse**. Instead of manually filtering data, just ask:

> 💬 **"How many requests were escalated today?"**
>
> 💬 **"Which category generates the most support requests?"**

The analytics layer turns operational data into useful insights.

---

## 🔄 How AutoOps Works

```mermaid
flowchart TD
    A([📥 Incoming Request]) --> B[🧾 Intake]
    B --> C{{🤖 AI Agent<br/>Groq}}
    C -->|✅ Simple, low risk| D[Resolve]
    C -->|📩 Sales opportunity| E[Follow Up]
    C -->|🚨 Risky or uncertain| F[Escalate to Human]
    C -->|🗑️ Spam| G[Reject]
    D --> H[(📊 Analytics & Dashboard)]
    E --> H
    F --> H
    G --> H

    style A fill:#6366F1,stroke:#4338CA,color:#fff
    style B fill:#8B5CF6,stroke:#6D28D9,color:#fff
    style C fill:#EC4899,stroke:#BE185D,color:#fff
    style D fill:#10B981,stroke:#047857,color:#fff
    style E fill:#3B82F6,stroke:#1D4ED8,color:#fff
    style F fill:#EF4444,stroke:#B91C1C,color:#fff
    style G fill:#6B7280,stroke:#374151,color:#fff
    style H fill:#F59E0B,stroke:#B45309,color:#fff
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="25%">

### 🎨 Frontend
- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Recharts**

</td>
<td valign="top" width="25%">

### 🤖 AI
- **Groq**
- Function calling
- Structured AI output

</td>
<td valign="top" width="25%">

### 📊 Data & Analytics
- **Neural Pulse**
- Local JSON storage (demo fallback)

</td>
<td valign="top" width="25%">

### ☁️ Deployment
- **Vercel**

</td>
</tr>
</table>

---

## 📂 Project Structure

```text
AutoOps/
│
├── 📁 app/
│   ├── 📁 api/
│   │   ├── actions/
│   │   ├── agent/
│   │   ├── analytics/
│   │   └── requests/
│   │
│   └── 📁 dashboard/
│       ├── analytics/
│       ├── escalations/
│       └── intake/
│
├── 📁 components/
│   ├── AnalyticsCharts
│   ├── AskNeuralPulse
│   ├── EscalationQueue
│   └── LiveActivityFeed
│
├── 📁 lib/
│   ├── agent/
│   ├── neuralpulse/
│   └── store.ts
│
├── 📁 data/
│   └── autoops.json
│
├── 📁 public/
│
├── 📄 AGENTS.md
├── 📄 CLAUDE.md
├── 📄 architecture.md
├── 📄 AutoOps-PRD-v2.md
└── 📄 README.md
```

---

## 🔌 API Routes

| Method | Endpoint | Purpose |
| :-: | :-- | :-- |
| ![POST](https://img.shields.io/badge/POST-10B981?style=flat-square) | `/api/requests` | Create a request |
| ![POST](https://img.shields.io/badge/POST-10B981?style=flat-square) | `/api/requests/upload` | Upload requests through CSV |
| ![GET](https://img.shields.io/badge/GET-3B82F6?style=flat-square) | `/api/requests` | Fetch requests |
| ![POST](https://img.shields.io/badge/POST-10B981?style=flat-square) | `/api/agent/process/:id` | Process a request with AI |
| ![POST](https://img.shields.io/badge/POST-10B981?style=flat-square) | `/api/actions/:id/execute` | Execute the selected action |
| ![GET](https://img.shields.io/badge/GET-3B82F6?style=flat-square) | `/api/escalations` | Fetch escalations |
| ![PATCH](https://img.shields.io/badge/PATCH-F59E0B?style=flat-square) | `/api/escalations/:id` | Update an escalation |
| ![GET](https://img.shields.io/badge/GET-3B82F6?style=flat-square) | `/api/analytics/summary` | Fetch analytics summary |
| ![POST](https://img.shields.io/badge/POST-10B981?style=flat-square) | `/api/analytics/query` | Ask natural-language analytics questions |

---

## ⚙️ Getting Started

**1️⃣ Clone the repository**

```bash
git clone https://github.com/Anushkagoel07/AutoOps.git
cd AutoOps
```

**2️⃣ Install dependencies**

```bash
npm install
```

**3️⃣ Configure environment variables**

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key
NEURAL_PULSE_API_KEY=your_neural_pulse_api_key
NEURAL_PULSE_BASE_URL=your_neural_pulse_base_url
```

**4️⃣ Run the development server**

```bash
npm run dev
```

Then open 👉 **http://localhost:3000**

> [!WARNING]
> 🔐 Keep API keys only in environment variables. Never commit `.env.local` or expose keys in client-side code.

---

## 🧪 Testing the Demo

Paste these four requests into the intake page:

```text
1. My card was charged twice for the same subscription.
2. How can I reset my password?
3. We are a 50-person company looking for your enterprise plan.
4. WIN FREE MONEY!!!
```

Then open the dashboard and watch the AI process each one. 🎬

---

## 🎯 Project Goals

AutoOps shows how AI can move beyond simple chatbots into **autonomous operational decision-making**.

<div align="center">

**🧠 LLM Reasoning** &nbsp;+&nbsp; **🎯 Structured Decisions** &nbsp;+&nbsp; **⚙️ Automated Actions** &nbsp;+&nbsp; **🧑‍💼 Human Escalation** &nbsp;+&nbsp; **📊 Analytics**

⬇️

**One end-to-end AI operations workflow**

</div>

---

## 🔮 Future Scope

- [ ] 📧 Real email integration
- [ ] 🔗 CRM integrations
- [ ] 💬 Slack / Teams notifications
- [ ] 🏢 Multi-tenant workspaces
- [ ] 🎯 Advanced lead scoring
- [ ] 🧑‍💼 Human-in-the-loop workflows
- [ ] 🤖 More specialized AI agents
- [ ] 🗄️ Production-grade persistent data infrastructure
- [ ] 📈 Advanced analytics and reporting

---

## 🏆 Hackathon Project

AutoOps was built as an AI-first automation platform that shows how autonomous agents can handle repetitive **support and sales operations**, while keeping humans in the loop for sensitive decisions.

---

<div align="center">

## 👩‍💻 Author

**Anushka Goel**

[![GitHub](https://img.shields.io/badge/GitHub-@Anushkagoel07-181717?style=for-the-badge&logo=github)](https://github.com/Anushkagoel07)

<br/>

### ⭐ If you like the project, give it a star!

**AI that doesn't just answer — it takes action.** 🚀

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:EC4899,50:8B5CF6,100:6366F1&height=120&section=footer" alt="footer" width="100%"/>

</div>
