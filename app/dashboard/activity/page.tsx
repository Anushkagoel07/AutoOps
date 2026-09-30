"use client";

import LiveActivityFeed from "@/components/dashboard/LiveActivityFeed";

export default function ActivityPage() {
  return (
    <main className="min-h-screen bg-[#080B0F] px-5 py-8 text-[#F1F5F9] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="autoops-fade-up mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#14B8A6]">
            Agent Operations
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Activity
              </h1>

              <p className="mt-2 text-sm text-[#64748B]">
                Monitor AI decisions, reasoning and automated actions.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#1D2933] bg-[#0F141A] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6] autoops-pulse" />

              <span className="text-xs text-[#94A3B8]">
                Agent activity
              </span>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="autoops-fade-up autoops-delay-1">
          <LiveActivityFeed />
        </div>

        {/* Information cards */}
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="autoops-scale-in rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#14B8A6]/30">
            <p className="text-xs uppercase tracking-wider text-[#64748B]">
              Classification
            </p>

            <h2 className="mt-3 font-semibold">
              Request understanding
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              The agent classifies incoming requests
              before deciding what should happen next.
            </p>
          </div>

          <div className="autoops-scale-in autoops-delay-1 rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#14B8A6]/30">
            <p className="text-xs uppercase tracking-wider text-[#64748B]">
              Decision
            </p>

            <h2 className="mt-3 font-semibold">
              Autonomous routing
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Requests can be resolved, followed up,
              escalated or rejected based on the agent decision.
            </p>
          </div>

          <div className="autoops-scale-in autoops-delay-2 rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#14B8A6]/30">
            <p className="text-xs uppercase tracking-wider text-[#64748B]">
              Reasoning
            </p>

            <h2 className="mt-3 font-semibold">
              Visible decision trail
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Each agent activity records the decision,
              reason, action and confidence.
            </p>
          </div>

        </section>
      </div>
    </main>
  );
}