"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05090B] text-[#F1F5F9]">

      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none fixed inset-0">

        <div className="absolute left-1/2 top-[-280px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#14B8A6]/10 blur-[140px]" />

        <div className="absolute bottom-[-300px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#0F766E]/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

      </div>


      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

        <a
          href="/"
          className="flex items-center gap-3"
        >

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
            <div className="h-2.5 w-2.5 rounded-full bg-[#14B8A6] shadow-[0_0_14px_#14B8A6]" />
          </div>

          <span className="text-sm font-semibold tracking-wide">
            AutoOps
          </span>

        </a>


        <div className="hidden items-center gap-8 text-xs text-[#64748B] md:flex">

          <a
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-white"
          >
            How it Works
          </a>

          <a
            href="#use-cases"
            className="transition hover:text-white"
          >
            Use Cases
          </a>

          <a
            href="#teams"
            className="transition hover:text-white"
          >
            For Teams
          </a>

        </div>


        <div className="hidden w-[70px] md:block" />

      </nav>


      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-16 sm:pt-20">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/15 bg-[#14B8A6]/5 px-3 py-1.5 text-[11px] text-[#94A3B8]">

            <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />

            Autonomous AI Operations

          </div>


          <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl md:text-[72px]">

            Turn messy workflows

            <br />

            into{" "}

            <span className="text-[#14B8A6]">
              intelligent systems.
            </span>

          </h1>


          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#64748B] sm:text-base">

            AutoOps is an autonomous AI SaaS agent that handles
            customer support tickets and sales leads with minimal
            human intervention.

          </p>


          {/* Dashboard CTA */}
          <div className="mt-7">

            <a
              href="/dashboard"
              className="inline-flex rounded-full bg-[#14B8A6] px-7 py-3 text-sm font-semibold text-[#04100E] transition hover:bg-[#2DD4BF] hover:shadow-[0_0_35px_rgba(20,184,166,0.2)]"
            >
              Dashboard
            </a>

          </div>

        </div>


        {/* ======================================================= */}
        {/* PRODUCT PREVIEW */}
        {/* ======================================================= */}

        <div className="relative mx-auto mt-14 max-w-5xl">

          <div className="absolute -inset-8 rounded-[40px] bg-[#14B8A6]/[0.06] blur-3xl" />


          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1116] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">

            {/* Window Header */}
            <div className="flex h-11 items-center justify-between border-b border-white/[0.07] px-4">

              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="h-2 w-2 rounded-full bg-white/10" />
              </div>

              <span className="text-[9px] uppercase tracking-[0.22em] text-[#475569]">
                AutoOps Intelligence
              </span>

              <div className="flex items-center gap-2 text-[9px] text-[#14B8A6]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
                AI Active
              </div>

            </div>


            {/* Dashboard Preview */}
            <div className="grid min-h-[330px] grid-cols-12">


              {/* Sidebar */}
              <div className="col-span-3 hidden border-r border-white/[0.07] p-5 sm:block">

                <div className="flex items-center gap-2">

                  <div className="h-5 w-5 rounded-full border border-white/10 bg-white/[0.03]">
                    <div className="mx-auto mt-[7px] h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
                  </div>

                  <span className="text-[11px] font-semibold">
                    AutoOps
                  </span>

                </div>


                <div className="mt-8 space-y-1.5">

                  <PreviewNav
                    text="Overview"
                    active
                  />

                  <PreviewNav text="Requests" />

                  <PreviewNav text="Analytics" />

                  <PreviewNav text="Escalations" />

                  <PreviewNav text="Activity" />

                </div>


                <div className="mt-10 rounded-xl border border-[#14B8A6]/10 bg-[#14B8A6]/[0.03] p-3">

                  <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />

                    <span className="text-[9px] text-[#94A3B8]">
                      Autonomous Agent
                    </span>

                  </div>

                  <p className="mt-2 text-[8px] leading-4 text-[#475569]">
                    Ready to process incoming requests.
                  </p>

                </div>

              </div>


              {/* Main Preview */}
              <div className="col-span-12 p-5 sm:col-span-9 sm:p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-left text-[12px] font-semibold text-[#E2E8F0]">
                      Operations Overview
                    </p>

                    <p className="mt-1 text-left text-[9px] text-[#475569]">
                      Autonomous workflow intelligence
                    </p>

                  </div>

                  <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[9px] text-[#64748B]">
                    Live Operations
                  </div>

                </div>


                {/* Stats */}
                <div className="mt-5 grid grid-cols-3 gap-3">

                  <PreviewMetric
                    label="Total Requests"
                    value="1,248"
                    change="+12.4%"
                  />

                  <PreviewMetric
                    label="Auto-Resolved"
                    value="892"
                    change="71.5%"
                  />

                  <PreviewMetric
                    label="Confidence"
                    value="94%"
                    change="High"
                  />

                </div>


                {/* Middle */}
                <div className="mt-3 grid gap-3 md:grid-cols-5">

                  {/* Decision Flow */}
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 md:col-span-3">

                    <div className="flex items-center justify-between">

                      <span className="text-[9px] text-[#64748B]">
                        Autonomous decision flow
                      </span>

                      <span className="text-[8px] text-[#475569]">
                        Real-time
                      </span>

                    </div>


                    <div className="mt-6 flex items-center justify-between">

                      <FlowBox
                        title="Intake"
                        subtitle="Request"
                      />

                      <FlowLine />

                      <FlowBox
                        title="AI Agent"
                        subtitle="Reasoning"
                        active
                      />

                      <FlowLine />

                      <FlowBox
                        title="Decision"
                        subtitle="Action"
                      />

                    </div>


                    <div className="mt-5 grid grid-cols-4 gap-2">

                      <MiniAction text="Resolve" />

                      <MiniAction text="Follow-up" />

                      <MiniAction text="Escalate" />

                      <MiniAction text="Reject" />

                    </div>

                  </div>


                  {/* Activity */}
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 md:col-span-2">

                    <span className="text-[9px] text-[#64748B]">
                      Recent activity
                    </span>


                    <div className="mt-4 space-y-3">

                      <PreviewActivity
                        title="Request resolved"
                        type="Support"
                      />

                      <PreviewActivity
                        title="Lead qualified"
                        type="Sales"
                      />

                      <PreviewActivity
                        title="Human review"
                        type="Escalated"
                      />

                      <PreviewActivity
                        title="Spam rejected"
                        type="Spam"
                      />

                    </div>

                  </div>

                </div>


                {/* Bottom indicators */}
                <div className="mt-3 grid grid-cols-3 gap-3">

                  <BottomIndicator
                    title="Neural Pulse"
                    status="Connected"
                  />

                  <BottomIndicator
                    title="AI Reasoning"
                    status="Operational"
                  />

                  <BottomIndicator
                    title="Human Queue"
                    status="Ready"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* Product statement */}
        <div className="mx-auto mt-7 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-2 pb-16 text-[9px] uppercase tracking-[0.16em] text-[#334155]">

          <span>AI Classification</span>
          <span>Autonomous Decisions</span>
          <span>Human Escalation</span>
          <span>Neural Pulse</span>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FEATURES */}
      {/* ========================================================= */}

      <section
        id="features"
        className="relative z-10 border-t border-white/[0.06] px-6 py-24"
      >

        <div className="mx-auto max-w-5xl">

          <p className="text-xs uppercase tracking-[0.2em] text-[#14B8A6]">
            Features
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Intelligence built for autonomous operations.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#64748B]">
            AutoOps combines AI reasoning, automated actions,
            human escalation and operational analytics into one workflow.
          </p>


          <div className="mt-12 grid gap-4 md:grid-cols-2">

            <Feature
              number="01"
              title="It decides, not just replies"
              text="AutoOps analyzes every incoming request, makes a decision and explains why — resolve, follow up, escalate or reject."
            />

            <Feature
              number="02"
              title="Confidence-aware automation"
              text="Every AI decision includes a confidence score. Uncertain or invalid outputs are routed to human review instead of silently guessing."
            />

            <Feature
              number="03"
              title="Support + Sales in one system"
              text="Handle customer support tickets and sales leads through the same autonomous reasoning pipeline."
            />

            <Feature
              number="04"
              title="Human escalation"
              text="Complex, critical or low-confidence requests become human tasks with a reason and suggested next action."
            />

            <Feature
              number="05"
              title="Transparent decision trail"
              text="Every decision records the category, priority, confidence, reason and action so operations remain traceable."
            />

            <Feature
              number="06"
              title="Neural Pulse intelligence"
              text="Neural Pulse acts as the primary data, processing and analytics layer for the operational system."
            />

            <Feature
              number="07"
              title="Multiple intake channels"
              text="Requests can enter through manual creation, CSV upload or a simulated webhook for demo workflows."
            />

            <Feature
              number="08"
              title="Graceful AI fallback"
              text="Validation failures, low confidence and AI service failures have defined fallback paths to human review."
            />

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* HOW IT WORKS */}
      {/* ========================================================= */}

      <section
        id="how-it-works"
        className="relative z-10 border-t border-white/[0.06] px-6 py-24"
      >

        <div className="mx-auto max-w-5xl">

          <p className="text-xs uppercase tracking-[0.2em] text-[#14B8A6]">
            How it works
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            From incoming request to autonomous action.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#64748B]">
            AutoOps follows a structured pipeline from intake and AI
            reasoning to execution and operational analytics.
          </p>


          <div className="mt-12 space-y-4">

            <WorkflowStep
              number="01"
              title="Ticket / Lead"
              description="A support ticket or sales lead enters AutoOps."
            />

            <WorkflowArrow />

            <WorkflowStep
              number="02"
              title="Intake"
              description="The request is captured with its name, email, message, type and creation time."
            />

            <WorkflowArrow />

            <WorkflowStep
              number="03"
              title="AI Agent"
              description="The agent analyzes the request and determines its category, priority, confidence, decision, reason and action."
            />

            <WorkflowArrow />

            <WorkflowStep
              number="04"
              title="Decision"
              description="The agent chooses one of four operational paths based on the request."
            />

            <WorkflowArrow />


            <div className="grid gap-4 md:grid-cols-4">

              <ActionCard
                title="Resolve"
                text="Generate a reply and resolve simple high-confidence requests."
              />

              <ActionCard
                title="Follow-up"
                text="Generate a personalized sales follow-up and assign a lead score."
              />

              <ActionCard
                title="Escalate"
                text="Create a human task with a reason and suggested next action."
              />

              <ActionCard
                title="Reject"
                text="Archive spam and remove it from the active workload."
              />

            </div>


            <WorkflowArrow />

            <WorkflowStep
              number="05"
              title="Neural Pulse"
              description="Decisions and actions are recorded in Neural Pulse as the primary data and analytics layer."
            />

            <WorkflowArrow />

            <WorkflowStep
              number="06"
              title="Operational Analytics"
              description="Recorded activity becomes visible through dashboards and natural-language analytics."
            />

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* USE CASES */}
      {/* ========================================================= */}

      <section
        id="use-cases"
        className="relative z-10 border-t border-white/[0.06] px-6 py-24"
      >

        <div className="mx-auto max-w-5xl">

          <p className="text-xs uppercase tracking-[0.2em] text-[#14B8A6]">
            Use Cases
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            One agent. Multiple operational workflows.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#64748B]">
            Automate the repetitive work while keeping people focused
            on complex and high-value cases.
          </p>


          <div className="mt-12 grid gap-4 md:grid-cols-2">

            <UseCase
              label="Customer Support"
              title="Handle repetitive tickets automatically."
              text="Classify support requests, assign priority and resolve simple high-confidence cases without manual intervention."
            />

            <UseCase
              label="Sales Operations"
              title="Turn qualified leads into follow-ups."
              text="Identify genuine sales intent, generate personalized follow-ups and assign a lead score."
            />

            <UseCase
              label="Human Review"
              title="Escalate what actually needs people."
              text="Complex, critical or low-confidence requests are routed to a human with context and a suggested next action."
            />

            <UseCase
              label="Operational Intelligence"
              title="Understand what your operations are doing."
              text="Every decision and action becomes part of an analytics layer that can be queried through Neural Pulse."
            />

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FOR TEAMS */}
      {/* ========================================================= */}

      <section
        id="teams"
        className="relative z-10 border-t border-white/[0.06] px-6 py-24"
      >

        <div className="mx-auto max-w-5xl">

          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-[#14B8A6]">
                For Teams
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Built for teams that are growing faster than their operations.
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#64748B]">
                AutoOps is designed for small businesses, solo founders,
                early-stage startups and growing SaaS teams that need
                first-line support and sales triage without immediately
                expanding their operations team.
              </p>

            </div>


            <div className="grid gap-3">

              <TeamCard
                title="Small Businesses"
                text="Automate repetitive customer requests without a dedicated support operations hire."
              />

              <TeamCard
                title="Early-Stage Startups"
                text="Let the agent handle first-line triage while the team focuses on product and growth."
              />

              <TeamCard
                title="Growing SaaS Teams"
                text="Bring support, sales follow-up, escalation and analytics into one autonomous workflow."
              />

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="relative z-10 border-t border-white/[0.06] px-6 py-24">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs uppercase tracking-[0.2em] text-[#14B8A6]">
            AutoOps
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
            Let AI handle the workflow.
            <br />
            Let humans handle what matters.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#64748B]">
            Autonomous first-line operations with transparent
            decisions and human escalation when needed.
          </p>

          <a
            href="/dashboard"
            className="mt-8 inline-flex rounded-full bg-[#14B8A6] px-7 py-3 text-sm font-semibold text-[#04100E] transition hover:bg-[#2DD4BF] hover:shadow-[0_0_35px_rgba(20,184,166,0.2)]"
          >
            Dashboard
          </a>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-7">

        <div className="mx-auto flex max-w-5xl flex-col gap-3 text-xs text-[#475569] sm:flex-row sm:items-center sm:justify-between">

          <span>
            © 2026 AutoOps
          </span>

          <span>
            Autonomous AI Operations
          </span>

        </div>

      </footer>

    </main>
  );
}


/* ============================================================= */
/* PREVIEW NAV */
/* ============================================================= */

function PreviewNav({
  text,
  active = false,
}: {
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-3 py-2 text-left text-[9px] ${
        active
          ? "bg-[#14B8A6]/10 text-[#14B8A6]"
          : "text-[#475569]"
      }`}
    >
      {text}
    </div>
  );
}


/* ============================================================= */
/* PREVIEW METRIC */
/* ============================================================= */

function PreviewMetric({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3">

      <p className="text-left text-[8px] text-[#64748B]">
        {label}
      </p>

      <div className="mt-2 flex items-end justify-between gap-2">

        <span className="text-left text-lg font-semibold text-[#E2E8F0]">
          {value}
        </span>

        <span className="text-[8px] text-[#14B8A6]">
          {change}
        </span>

      </div>

    </div>
  );
}


/* ============================================================= */
/* FLOW BOX */
/* ============================================================= */

function FlowBox({
  title,
  subtitle,
  active = false,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
}) {
  return (
    <div
      className={`min-w-[65px] rounded-lg border px-3 py-2.5 text-center ${
        active
          ? "border-[#14B8A6]/30 bg-[#14B8A6]/10"
          : "border-white/[0.07] bg-white/[0.02]"
      }`}
    >

      <p
        className={`text-[9px] font-medium ${
          active
            ? "text-[#14B8A6]"
            : "text-[#CBD5E1]"
        }`}
      >
        {title}
      </p>

      <p className="mt-1 text-[7px] text-[#475569]">
        {subtitle}
      </p>

    </div>
  );
}


/* ============================================================= */
/* FLOW LINE */
/* ============================================================= */

function FlowLine() {
  return (
    <div className="mx-1 h-px flex-1 bg-gradient-to-r from-white/[0.05] via-[#14B8A6]/30 to-white/[0.05]" />
  );
}


/* ============================================================= */
/* MINI ACTION */
/* ============================================================= */

function MiniAction({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.015] px-2 py-1.5 text-center text-[7px] text-[#64748B]">
      {text}
    </div>
  );
}


/* ============================================================= */
/* PREVIEW ACTIVITY */
/* ============================================================= */

function PreviewActivity({
  title,
  type,
}: {
  title: string;
  type: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">

      <div className="flex items-center gap-2">

        <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />

        <span className="text-[8px] text-[#94A3B8]">
          {title}
        </span>

      </div>

      <span className="text-[7px] text-[#475569]">
        {type}
      </span>

    </div>
  );
}


/* ============================================================= */
/* BOTTOM INDICATOR */
/* ============================================================= */

function BottomIndicator({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.015] px-3 py-2">

      <span className="text-[8px] text-[#475569]">
        {title}
      </span>

      <div className="flex items-center gap-1.5">

        <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />

        <span className="text-[8px] text-[#64748B]">
          {status}
        </span>

      </div>

    </div>
  );
}


/* ============================================================= */
/* FEATURE CARD */
/* ============================================================= */

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-[#14B8A6]/20 hover:bg-[#14B8A6]/[0.02]">

      <div className="flex items-start justify-between">

        <span className="text-xs text-[#14B8A6]">
          {number}
        </span>

        <span className="text-[#1E293B] transition group-hover:text-[#14B8A6]/40">
          ↗
        </span>

      </div>

      <h3 className="mt-7 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#64748B]">
        {text}
      </p>

    </div>
  );
}


/* ============================================================= */
/* WORKFLOW STEP */
/* ============================================================= */

function WorkflowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-[#14B8A6]/20">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#14B8A6]/20 bg-[#14B8A6]/5 text-[10px] font-medium text-[#14B8A6]">
          {number}
        </span>

        <div>

          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#64748B]">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}


/* ============================================================= */
/* WORKFLOW ARROW */
/* ============================================================= */

function WorkflowArrow() {
  return (
    <div className="flex justify-center py-1 text-[#14B8A6]/50">
      ↓
    </div>
  );
}


/* ============================================================= */
/* ACTION CARD */
/* ============================================================= */

function ActionCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#14B8A6]/10 bg-[#14B8A6]/[0.025] p-5">

      <div className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-[#64748B]">
        {text}
      </p>

    </div>
  );
}


/* ============================================================= */
/* USE CASE */
/* ============================================================= */

function UseCase({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-[#14B8A6]/20 hover:bg-[#14B8A6]/[0.02]">

      <span className="text-[10px] uppercase tracking-[0.16em] text-[#14B8A6]">
        {label}
      </span>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#64748B]">
        {text}
      </p>

    </div>
  );
}


/* ============================================================= */
/* TEAM CARD */
/* ============================================================= */

function TeamCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-[#14B8A6]/20">

      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#64748B]">
        {text}
      </p>

    </div>
  );
}