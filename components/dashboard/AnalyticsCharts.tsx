"use client";

import { useState } from "react";

export default function AskNeuralPulse() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnswer("");

      const response = await fetch(
        "/api/analytics/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: trimmedQuery,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Analytics query failed"
        );
      }

      const result = data?.result;

      const formattedAnswer =
        typeof result === "string"
          ? result
          : JSON.stringify(result, null, 2);

      setAnswer(formattedAnswer);
    } catch (err) {
      console.error("Ask Neural Pulse error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Analytics query failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#1D2933] bg-[#111827] p-5">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">
          Ask Neural Pulse
        </h2>

        <p className="mt-1 text-sm text-[#64748B]">
          Ask questions about your AutoOps data
        </p>
      </div>

      <form
        onSubmit={handleAsk}
        className="space-y-3"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="e.g. How many requests were escalated?"
            className="flex-1 rounded-lg border border-[#334155] bg-[#05080D] px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-[#14B8A6]"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Ask"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {answer && (
          <div className="rounded-lg border border-[#1D2933] bg-[#080B0F] p-4">
            <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#64748B]">
              Neural Pulse Response
            </p>

            <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-[#CBD5E1]">
              {answer}
            </pre>
          </div>
        )}
      </form>
    </section>
  );
}