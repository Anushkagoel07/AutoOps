"use client";

import { useEffect, useState } from "react";

interface Escalation {
  id: string;
  request_id?: string;
  summary?: string;
  reason?: string;
  suggested_action?: string;
  status?: string | { status?: string };
  created_at?: string;
  priority?: string;
  request?: {
    name?: string;
    email?: string;
    message?: string;
  };
}

function normalizeStatus(value: unknown): string {
  if (typeof value === "string") {
    return value.toLowerCase();
  }

  if (
    value &&
    typeof value === "object" &&
    "status" in value
  ) {
    const status = (value as { status?: unknown }).status;

    if (typeof status === "string") {
      return status.toLowerCase();
    }
  }

  return "pending";
}

function formatStatus(value: unknown) {
  return normalizeStatus(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
}

export default function EscalationQueue() {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  async function fetchEscalations() {
    try {
      const response = await fetch(
        "/api/escalations",
        {
          cache: "no-store",
        }
      );

      const text = await response.text();

      let data: any = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Invalid response from escalation API"
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to fetch escalations"
        );
      }

      const items = Array.isArray(
        data?.escalations
      )
        ? data.escalations
        : [];

      setEscalations(items);
      setError("");
    } catch (err) {
      console.error(
        "Escalation queue error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch escalations"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEscalations();

    const interval = setInterval(
      fetchEscalations,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  async function updateStatus(
    id: string,
    status: string
  ) {
    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(
        `/api/escalations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const text = await response.text();

      let data: any = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Invalid response from status update"
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to update escalation"
        );
      }

      await fetchEscalations();
    } catch (err) {
      console.error(
        "Update escalation error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update escalation"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const pendingCount = escalations.filter(
    (item) =>
      normalizeStatus(item.status) === "pending"
  ).length;

  const inProgressCount = escalations.filter(
    (item) =>
      normalizeStatus(item.status) ===
      "in_progress"
  ).length;

  const resolvedCount = escalations.filter(
    (item) =>
      normalizeStatus(item.status) ===
      "resolved"
  ).length;

  return (
    <section className="rounded-2xl border border-[#1D2933] bg-[#0F141A]">

      {/* HEADER */}

      <div className="border-b border-[#1D2933] p-5">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-base font-semibold text-white">
              Human Review Queue
            </h2>

            <p className="mt-1 text-xs text-[#64748B]">
              Requests requiring human attention
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <StatusCount
              label="Pending"
              value={pendingCount}
            />

            <StatusCount
              label="In Progress"
              value={inProgressCount}
            />

            <StatusCount
              label="Resolved"
              value={resolvedCount}
            />

          </div>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="mx-5 mt-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}


      {/* CONTENT */}

      {loading ? (

        <div className="p-10 text-center text-sm text-[#64748B]">
          Loading escalation queue...
        </div>

      ) : escalations.length === 0 ? (

        <div className="p-10 text-center">

          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[#1D2933] bg-[#080B0F] text-[#475569]">
            ✓
          </div>

          <p className="mt-3 text-sm text-[#64748B]">
            No escalations
          </p>

          <p className="mt-1 text-xs text-[#334155]">
            Requests requiring human review will appear here.
          </p>

        </div>

      ) : (

        <div className="divide-y divide-[#1D2933]">

          {escalations.map((escalation) => {

            const status = normalizeStatus(
              escalation.status
            );

            const isUpdating =
              updatingId === escalation.id;

            return (
              <div
                key={escalation.id}
                className="p-5 transition hover:bg-white/[0.015]"
              >

                {/* TOP */}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-red-400">
                        Human Review
                      </span>

                      <span className="rounded-md border border-[#1D2933] bg-[#080B0F] px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-[#64748B]">
                        {formatStatus(
                          escalation.status
                        )}
                      </span>

                    </div>

                    <p className="mt-3 text-sm font-medium text-white">
                      {escalation.summary ||
                        "Escalated customer request"}
                    </p>

                    {escalation.request?.message && (
                      <p className="mt-2 text-sm leading-6 text-[#64748B]">
                        {escalation.request.message}
                      </p>
                    )}

                  </div>


                  {/* PRIORITY */}

                  <div className="shrink-0">

                    <span className="rounded-md border border-[#1D2933] bg-[#080B0F] px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] text-[#94A3B8]">
                      {escalation.priority ||
                        "High Priority"}
                    </span>

                  </div>

                </div>


                {/* DETAILS */}

                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  <Detail
                    label="Reason"
                    value={
                      escalation.reason ||
                      "Request requires human review."
                    }
                  />

                  <Detail
                    label="Suggested Action"
                    value={
                      escalation.suggested_action ||
                      "Review request and take appropriate action."
                    }
                  />

                  <Detail
                    label="Created"
                    value={formatDate(
                      escalation.created_at
                    )}
                  />

                </div>


                {/* REQUEST INFO */}

                {(escalation.request?.name ||
                  escalation.request?.email) && (

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-[#1D2933] pt-4">

                    {escalation.request?.name && (
                      <span className="text-xs text-[#64748B]">
                        Customer:{" "}
                        <span className="text-[#CBD5E1]">
                          {escalation.request.name}
                        </span>
                      </span>
                    )}

                    {escalation.request?.email && (
                      <span className="text-xs text-[#64748B]">
                        Email:{" "}
                        <span className="text-[#CBD5E1]">
                          {escalation.request.email}
                        </span>
                      </span>
                    )}

                    {escalation.request_id && (
                      <span className="text-xs text-[#64748B]">
                        Request ID:{" "}
                        <span className="font-mono text-[#CBD5E1]">
                          {escalation.request_id}
                        </span>
                      </span>
                    )}

                  </div>
                )}


                {/* ACTIONS */}

                <div className="mt-5 flex flex-wrap gap-2">

                  {status === "pending" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(
                          escalation.id,
                          "in_progress"
                        )
                      }
                      className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isUpdating
                        ? "Updating..."
                        : "Start Review"}
                    </button>
                  )}

                  {status === "in_progress" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(
                          escalation.id,
                          "resolved"
                        )
                      }
                      className="rounded-lg bg-[#14B8A6] px-4 py-2 text-xs font-medium text-black transition hover:bg-[#0d9488] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isUpdating
                        ? "Updating..."
                        : "Resolve"}
                    </button>
                  )}

                  {status === "resolved" && (
                    <span className="rounded-lg border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-4 py-2 text-xs text-[#14B8A6]">
                      Resolved
                    </span>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      )}

    </section>
  );
}


/* =========================================================
   STATUS COUNT
========================================================= */

function StatusCount({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-[#1D2933] bg-[#080B0F] px-3 py-2">

      <p className="text-[9px] uppercase tracking-[0.1em] text-[#475569]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   DETAIL
========================================================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#1D2933] bg-[#080B0F] p-3">

      <p className="text-[9px] uppercase tracking-[0.1em] text-[#475569]">
        {label}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#94A3B8]">
        {value}
      </p>

    </div>
  );
}