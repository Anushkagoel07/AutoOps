"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AskNeuralPulse from "@/components/dashboard/AskNeuralPulse";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import LiveActivityFeed from "@/components/dashboard/LiveActivityFeed";
import EscalationQueue from "@/components/dashboard/EscalationQueue";

interface RequestItem {
  id: string;
  name?: string;
  email?: string;
  message?: string;
  type?: string;
  category?: string;
  priority?: string;
  confidence?: number;
  decision?: string;
  reason?: string;
  action?: string;
  status?: string;
  created_at?: string;
}

export default function DashboardPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRequests() {
    try {
      const response = await fetch("/api/requests", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to fetch requests"
        );
      }

      setRequests(
        Array.isArray(data?.requests)
          ? data.requests
          : []
      );

      setError("");
    } catch (err) {
      console.error("Dashboard request error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch requests"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();

    const interval = setInterval(() => {
      fetchRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const total = requests.length;

    const support = requests.filter(
      (request) =>
        request.type?.toLowerCase() === "support"
    ).length;

    const sales = requests.filter(
      (request) =>
        request.type?.toLowerCase() === "sales"
    ).length;

    const autoResolved = requests.filter(
      (request) =>
        request.decision === "auto_resolve"
    ).length;

    const followUps = requests.filter(
      (request) =>
        request.decision === "follow_up"
    ).length;

    const escalations = requests.filter(
      (request) =>
        request.decision === "escalate"
    ).length;

    const rejected = requests.filter(
      (request) =>
        request.decision === "reject"
    ).length;

    const resolutionRate =
      total > 0
        ? Math.round(
            (autoResolved / total) * 100
          )
        : 0;

    return {
      total,
      support,
      sales,
      autoResolved,
      followUps,
      escalations,
      rejected,
      resolutionRate,
    };
  }, [requests]);

  return (
    <main className="min-h-screen bg-[#080B0F] text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-[#1D2933]">
        <div className="mx-auto max-w-[1500px] px-6 py-7">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#14B8A6] shadow-[0_0_12px_rgba(20,184,166,0.7)]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#14B8A6]">
                  Autonomous Operations
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                Operations Overview
              </h1>

              <p className="mt-2 text-sm text-[#64748B]">
                Monitor how AutoOps receives, reasons over,
                and acts on customer requests.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <div className="flex items-center gap-2 rounded-full border border-[#1D2933] bg-[#0F141A] px-4 py-2">

                <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />

                <span className="text-[10px] uppercase tracking-[0.14em] text-[#64748B]">
                  System Operational
                </span>

              </div>

              <Link
                href="/dashboard/requests"
                className="rounded-lg border border-[#1D2933] bg-[#0F141A] px-4 py-2 text-xs text-[#CBD5E1] transition hover:border-[#334155] hover:text-white"
              >
                View Requests
              </Link>

            </div>

          </div>

        </div>
      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-[1500px] px-6 py-7">

        {/* ===================================================
            ASK NEURAL PULSE — TOP
        =================================================== */}

        <div className="mb-6">
          <AskNeuralPulse />
        </div>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}


        {/* ===================================================
            OVERVIEW CARDS
        =================================================== */}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          <StatCard
            label="Total Requests"
            value={
              loading
                ? "—"
                : stats.total
            }
            description="All incoming requests"
          />

          <StatCard
            label="Support"
            value={
              loading
                ? "—"
                : stats.support
            }
            description="Customer support"
          />

          <StatCard
            label="Sales"
            value={
              loading
                ? "—"
                : stats.sales
            }
            description="Sales opportunities"
          />

          <StatCard
            label="Auto-Resolved"
            value={
              loading
                ? "—"
                : stats.autoResolved
            }
            description="Handled automatically"
            accent
          />

          <StatCard
            label="Escalations"
            value={
              loading
                ? "—"
                : stats.escalations
            }
            description="Human review required"
          />

          <StatCard
            label="Resolution Rate"
            value={
              loading
                ? "—"
                : `${stats.resolutionRate}%`
            }
            description="Automatic resolution"
            accent
          />

        </section>


        {/* ===================================================
            QUICK DECISION SUMMARY
        =================================================== */}

        <section className="mt-5 rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-base font-semibold">
                Decision Distribution
              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                How the AI agent is routing requests
              </p>
            </div>

            <span className="rounded-lg border border-[#1D2933] bg-[#080B0F] px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-[#64748B]">
              AI Decisions
            </span>

          </div>

          <div className="space-y-5">

            <DecisionBar
              label="Auto Resolve"
              value={stats.autoResolved}
              total={stats.total}
            />

            <DecisionBar
              label="Follow-up"
              value={stats.followUps}
              total={stats.total}
            />

            <DecisionBar
              label="Escalate"
              value={stats.escalations}
              total={stats.total}
              active
            />

            <DecisionBar
              label="Reject"
              value={stats.rejected}
              total={stats.total}
            />

          </div>

        </section>


        {/* ===================================================
            ANALYTICS CHARTS
        =================================================== */}

        <section className="mt-5">
          <AnalyticsCharts />
        </section>


        {/* ===================================================
            LIVE ACTIVITY
        =================================================== */}

        <section className="mt-5">
          <LiveActivityFeed />
        </section>


        {/* ===================================================
            ESCALATION QUEUE
        =================================================== */}

        <section className="mt-5">
          <EscalationQueue />
        </section>

      </div>

    </main>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  description,
  accent = false,
}: {
  label: string;
  value: string | number;
  description: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5">

      <p className="text-[9px] uppercase tracking-[0.16em] text-[#475569]">
        {label}
      </p>

      <p
        className={`mt-4 text-3xl font-semibold ${
          accent
            ? "text-[#14B8A6]"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-[10px] text-[#475569]">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   DECISION BAR
========================================================= */

function DecisionBar({
  label,
  value,
  total,
  active = false,
}: {
  label: string;
  value: number;
  total: number;
  active?: boolean;
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-xs text-[#94A3B8]">
          {label}
        </span>

        <span className="text-xs font-medium text-white">
          {value}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#18232C]">

        <div
          className={`h-full rounded-full transition-all duration-500 ${
            active
              ? "bg-[#14B8A6]"
              : "bg-[#22313B]"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="mt-1 text-[9px] text-[#475569]">
        {percentage}% of requests
      </p>

    </div>
  );
}