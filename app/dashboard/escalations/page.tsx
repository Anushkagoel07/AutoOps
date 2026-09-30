"use client";

import { useEffect, useMemo, useState } from "react";

type Escalation = {
  id: string;
  request_id: string;
  summary: string;
  reason: string;
  suggested_action?: string | null;
  status:
    | "pending"
    | "in_progress"
    | "resolved"
    | string
    | { status?: string };
  created_at: string;
};

type ApiResponse = {
  success?: boolean;
  escalations?: Escalation[];
  escalation?: Escalation;
  error?: string;
};

function normalizeStatus(
  status: Escalation["status"]
): "pending" | "in_progress" | "resolved" {
  if (typeof status === "string") {
    const value = status.toLowerCase();

    if (value === "in_progress") return "in_progress";
    if (value === "resolved") return "resolved";

    return "pending";
  }

  if (status && typeof status === "object") {
    const value = status.status?.toLowerCase();

    if (value === "in_progress") return "in_progress";
    if (value === "resolved") return "resolved";
  }

  return "pending";
}

function formatStatus(status: Escalation["status"]) {
  const normalized = normalizeStatus(status);

  if (normalized === "in_progress") return "In Progress";
  if (normalized === "resolved") return "Resolved";

  return "Pending";
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleString();
  } catch {
    return date;
  }
}

export default function EscalationsPage() {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function fetchEscalations() {
    try {
      setError("");

      const response = await fetch("/api/escalations", {
        cache: "no-store",
      });

      const text = await response.text();

      let data: ApiResponse;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Escalations API returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to fetch escalations"
        );
      }

      const list = Array.isArray(data?.escalations)
        ? data.escalations
        : [];

      setEscalations(list);
    } catch (err) {
      console.error("Fetch escalations error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch escalations"
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id: string,
    status: "in_progress" | "resolved"
  ) {
    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(`/api/escalations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const text = await response.text();

      let data: ApiResponse;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Escalation update API returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to update escalation"
        );
      }

      /*
       * Refetch instead of directly inserting the PATCH response
       * into state. This prevents an object such as
       * { status: "in_progress" } from accidentally being rendered.
       */
      await fetchEscalations();
    } catch (err) {
      console.error("Update escalation error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update escalation"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    fetchEscalations();
  }, []);

  const stats = useMemo(() => {
    let pending = 0;
    let inProgress = 0;
    let resolved = 0;

    for (const escalation of escalations) {
      const status = normalizeStatus(escalation.status);

      if (status === "pending") {
        pending++;
      } else if (status === "in_progress") {
        inProgress++;
      } else if (status === "resolved") {
        resolved++;
      }
    }

    return {
      pending,
      inProgress,
      resolved,
    };
  }, [escalations]);

  return (
    <main className="min-h-screen bg-[#080B0F] px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#14B8A6]">
              Human Review
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Escalations
            </h1>

            <p className="mt-2 text-sm text-[#64748B]">
              Requests that require human attention.
            </p>
          </div>

          <button
            onClick={fetchEscalations}
            disabled={loading}
            className="rounded-xl border border-[#1D2933] bg-[#0F141A] px-4 py-2.5 text-sm text-[#94A3B8] transition hover:border-[#14B8A6]/30 hover:text-white disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <StatCard
            label="Pending"
            value={stats.pending}
            description="Waiting for review"
          />

          <StatCard
            label="In Progress"
            value={stats.inProgress}
            description="Currently being reviewed"
          />

          <StatCard
            label="Resolved"
            value={stats.resolved}
            description="Completed reviews"
            accent
          />

        </div>

        {/* QUEUE */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#1D2933] bg-[#0F141A]">

          <div className="border-b border-[#1D2933] px-5 py-5">
            <h2 className="text-lg font-semibold">
              Human Review Queue
            </h2>

            <p className="mt-1 text-xs text-[#64748B]">
              Review and resolve escalated requests.
            </p>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="px-5 py-16 text-center text-sm text-[#64748B]">
              Loading escalations...
            </div>
          ) : escalations.length === 0 ? (
            /* EMPTY */
            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#1D2933] bg-[#080B0F] text-[#14B8A6]">
                ✓
              </div>

              <p className="mt-4 text-sm text-[#94A3B8]">
                No open escalations.
              </p>

              <p className="mt-1 text-xs text-[#475569]">
                Everything is currently under control.
              </p>

            </div>
          ) : (
            /* LIST */
            <div className="divide-y divide-[#1D2933]">

              {escalations.map((escalation) => {
                const status = normalizeStatus(
                  escalation.status
                );

                return (
                  <div
                    key={escalation.id}
                    className="px-5 py-5 transition hover:bg-white/[0.015]"
                  >

                    {/* TOP ROW */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="text-sm font-medium text-[#E2E8F0]">
                            Request #
                            {escalation.request_id}
                          </span>

                          <StatusBadge status={status} />

                        </div>

                      </div>

                      {/* ACTION BUTTON */}
                      <div className="shrink-0">

                        {status === "pending" && (
                          <button
                            onClick={() =>
                              updateStatus(
                                escalation.id,
                                "in_progress"
                              )
                            }
                            disabled={
                              updatingId === escalation.id
                            }
                            className="rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/5 px-4 py-2.5 text-xs font-medium text-[#14B8A6] transition hover:bg-[#14B8A6]/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingId === escalation.id
                              ? "Starting..."
                              : "Start Review"}
                          </button>
                        )}

                        {status === "in_progress" && (
                          <button
                            onClick={() =>
                              updateStatus(
                                escalation.id,
                                "resolved"
                              )
                            }
                            disabled={
                              updatingId === escalation.id
                            }
                            className="rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/5 px-4 py-2.5 text-xs font-medium text-[#14B8A6] transition hover:bg-[#14B8A6]/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingId === escalation.id
                              ? "Resolving..."
                              : "Resolve"}
                          </button>
                        )}

                        {status === "resolved" && (
                          <span className="text-xs text-[#14B8A6]">
                            Completed
                          </span>
                        )}

                      </div>
                    </div>

                    {/* SUMMARY */}
                    <p className="mt-4 text-sm leading-6 text-[#CBD5E1]">
                      {String(escalation.summary || "")}
                    </p>

                    {/* REASON */}
                    {escalation.reason && (
                      <p className="mt-2 text-xs leading-5 text-[#64748B]">
                        <span className="text-[#475569]">
                          Reason:
                        </span>{" "}
                        {String(escalation.reason)}
                      </p>
                    )}

                    {/* SUGGESTED ACTION */}
                    {escalation.suggested_action && (
                      <p className="mt-2 text-xs leading-5 text-[#64748B]">
                        <span className="text-[#475569]">
                          Suggested action:
                        </span>{" "}
                        {String(escalation.suggested_action)}
                      </p>
                    )}

                    {/* DATE */}
                    <p className="mt-3 text-[11px] text-[#475569]">
                      Created{" "}
                      {formatDate(escalation.created_at)}
                    </p>

                  </div>
                );
              })}

            </div>
          )}

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
  value: number;
  description: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5">

      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-semibold ${
          accent
            ? "text-[#14B8A6]"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs text-[#64748B]">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: "pending" | "in_progress" | "resolved";
}) {
  const label = formatStatus(status);

  const classes =
    status === "resolved"
      ? "border-[#14B8A6]/20 bg-[#14B8A6]/5 text-[#14B8A6]"
      : status === "in_progress"
      ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
      : "border-red-500/20 bg-red-500/5 text-red-400";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] ${classes}`}
    >
      {label}
    </span>
  );
}