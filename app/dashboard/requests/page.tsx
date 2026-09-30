"use client";

import { useEffect, useState } from "react";

interface RequestItem {
  id: string;
  name: string;
  email: string;
  message: string;
  type: "support" | "sales";
  created_at: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [filter, setFilter] = useState<
    "all" | "support" | "sales"
  >("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRequests() {
  try {
    setError("");

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
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Failed to fetch requests"
    );
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter(
          (request) => request.type === filter
        );

  const supportCount = requests.filter(
    (request) => request.type === "support"
  ).length;

  const salesCount = requests.filter(
    (request) => request.type === "sales"
  ).length;

  return (
    <main className="min-h-screen bg-[#080B0F] px-5 py-8 text-[#F1F5F9] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="autoops-fade-up mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#14B8A6]">
            Operations
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Requests
              </h1>

              <p className="mt-2 text-sm text-[#64748B]">
                Manage incoming support and sales requests.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchRequests}
              className="w-fit rounded-xl border border-[#1D2933] bg-[#0F141A] px-4 py-2.5 text-sm text-[#94A3B8] transition hover:border-[#14B8A6]/30 hover:text-[#14B8A6]"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="autoops-scale-in rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5 transition hover:-translate-y-1 hover:border-[#14B8A6]/30">
            <p className="text-xs uppercase tracking-wider text-[#64748B]">
              Total
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {requests.length}
            </p>
          </div>

          <div className="autoops-scale-in autoops-delay-1 rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5 transition hover:-translate-y-1 hover:border-[#14B8A6]/30">
            <p className="text-xs uppercase tracking-wider text-[#64748B]">
              Support
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {supportCount}
            </p>
          </div>

          <div className="autoops-scale-in autoops-delay-2 rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5 transition hover:-translate-y-1 hover:border-[#14B8A6]/30">
            <p className="text-xs uppercase tracking-wider text-[#64748B]">
              Sales
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {salesCount}
            </p>
          </div>
        </div>

        {/* Request Table */}
        <section className="autoops-fade-up overflow-hidden rounded-2xl border border-[#1D2933] bg-[#0F141A]">

          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-[#1D2933] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                All Requests
              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                Incoming requests from your operations pipeline
              </p>
            </div>

            <div className="flex gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Support", value: "support" },
                { label: "Sales", value: "sales" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setFilter(
                      item.value as
                        | "all"
                        | "support"
                        | "sales"
                    )
                  }
                  className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                    filter === item.value
                      ? "border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6]"
                      : "border-[#1D2933] text-[#64748B] hover:text-[#CBD5E1]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-[#64748B]">
              Loading requests...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-sm text-red-400">
              {error}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#1D2933] bg-[#080B0F] text-[#64748B]">
                —
              </div>

              <p className="mt-4 text-sm text-[#94A3B8]">
                No requests found.
              </p>

              <p className="mt-1 text-xs text-[#475569]">
                Requests will appear here when they are received.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1D2933]">
              {filteredRequests.map(
                (request, index) => (
                  <div
                    key={request.id}
                    className="autoops-fade-in p-5 transition hover:bg-white/[0.015]"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">
                            {request.name}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] ${
                              request.type === "support"
                                ? "border-[#14B8A6]/20 bg-[#14B8A6]/5 text-[#14B8A6]"
                                : "border-white/10 bg-white/[0.03] text-[#94A3B8]"
                            }`}
                          >
                            {request.type}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-[#64748B]">
                          {request.email}
                        </p>

                        <p className="mt-4 max-w-4xl text-sm leading-6 text-[#CBD5E1]">
                          {request.message}
                        </p>
                      </div>

                      <div className="shrink-0 text-left lg:text-right">
                        <p className="text-xs text-[#475569]">
                          {new Date(
                            request.created_at
                          ).toLocaleString()}
                        </p>

                        <span className="mt-3 inline-block rounded-lg border border-[#1D2933] bg-[#080B0F] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#64748B]">
                          Received
                        </span>
                      </div>

                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}