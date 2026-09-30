"use client";

import { useState } from "react";

export default function AskNeuralPulse() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();

    if (!query.trim()) {
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
            query: query.trim(),
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

      setAnswer(
        typeof result === "string"
          ? result
          : JSON.stringify(result, null, 2)
      );
    } catch (err) {
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
    <section className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">
          Ask Neural Pulse
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Ask questions about your AutoOps data
        </p>
      </div>

      <form onSubmit={handleAsk} className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. How many requests were escalated?"
            className="flex-1 rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-white px-5 py-3 font-medium text-black disabled:opacity-50"
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
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">
              Neural Pulse Response
            </p>

            <pre className="whitespace-pre-wrap break-words text-sm text-gray-300">
              {answer}
            </pre>
          </div>
        )}
      </form>
    </section>
  );
}