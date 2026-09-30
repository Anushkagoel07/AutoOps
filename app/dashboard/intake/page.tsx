"use client";

import { FormEvent, useState } from "react";

type RequestType = "support" | "sales";

interface AgentResult {
  category?: string;
  priority?: string;
  confidence?: number;
  decision?: string;
  reason?: string;
  action?: string;
  draft_content?: string | null;
}

export default function IntakePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<RequestType>("support");

  const [submitting, setSubmitting] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");

  const [agentResult, setAgentResult] =
    useState<AgentResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setMessageText("");
    setError("");
    setAgentResult(null);

    try {
      // --------------------------------------------------
      // 1. CREATE REQUEST
      // --------------------------------------------------

      const requestResponse = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          type,
        }),
      });

      const requestData = await requestResponse.json();

      if (!requestResponse.ok) {
        throw new Error(
          requestData?.error || "Failed to create request"
        );
      }

      // Support different response shapes safely
      const request =
        requestData?.request ??
        requestData?.data?.request ??
        requestData?.data;

      const requestId =
        request?.id ??
        requestData?.request_id ??
        requestData?.id;

      if (!requestId) {
        throw new Error(
          "Request was created, but request ID was not returned."
        );
      }

      // --------------------------------------------------
      // 2. AUTOMATICALLY PROCESS WITH AI
      // --------------------------------------------------

      const agentResponse = await fetch(
        `/api/agent/process/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const agentData = await agentResponse.json();

      if (!agentResponse.ok) {
        throw new Error(
          agentData?.error ||
            "Request was created, but AI processing failed."
        );
      }

      // --------------------------------------------------
      // 3. GET AI RESULT
      // --------------------------------------------------

      const result =
        agentData?.agent ??
        agentData?.result ??
        agentData?.data?.agent ??
        null;

      setAgentResult(result);

      // --------------------------------------------------
      // 4. SUCCESS MESSAGE
      // --------------------------------------------------

      setMessageText(
        "Request submitted and processed successfully."
      );

      // --------------------------------------------------
      // 5. RESET FORM
      // --------------------------------------------------

      setName("");
      setEmail("");
      setMessage("");
      setType("support");
    } catch (err) {
      console.error("Intake submit error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function formatDecision(decision?: string) {
    if (!decision) return "Pending";

    return decision
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  }

  function formatValue(value?: string) {
    if (!value) return "—";

    return value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  }

  return (
    <main className="min-h-screen bg-[#080B0F] px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8">

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#14B8A6] shadow-[0_0_12px_rgba(20,184,166,0.7)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#14B8A6]">
              Customer Intake
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Submit a Request
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
            Submit a support request or sales inquiry.
            AutoOps will analyze it and decide what action
            should be taken.
          </p>

        </div>

        {/* MAIN GRID */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">

          {/* FORM CARD */}
          <section className="rounded-2xl border border-[#1D2933] bg-[#0F141A] p-6">

            <div className="mb-6">
              <h2 className="text-base font-semibold text-white">
                Customer Request
              </h2>

              <p className="mt-1 text-xs text-[#64748B]">
                All fields are required.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-[#CBD5E1]"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-[#1D2933] bg-[#080B0F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#475569] focus:border-[#14B8A6]/60"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-[#CBD5E1]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-[#1D2933] bg-[#080B0F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#475569] focus:border-[#14B8A6]/60"
                />
              </div>

              {/* TYPE */}
              <div>
                <label
                  htmlFor="type"
                  className="mb-2 block text-xs font-medium text-[#CBD5E1]"
                >
                  Request Type
                </label>

                <select
                  id="type"
                  value={type}
                  onChange={(event) =>
                    setType(
                      event.target.value as RequestType
                    )
                  }
                  className="w-full rounded-xl border border-[#1D2933] bg-[#080B0F] px-4 py-3 text-sm text-white outline-none transition focus:border-[#14B8A6]/60"
                >
                  <option value="support">
                    Support Request
                  </option>

                  <option value="sales">
                    Sales Inquiry
                  </option>
                </select>
              </div>

              {/* MESSAGE */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-xs font-medium text-[#CBD5E1]"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Describe your request..."
                  required
                  rows={7}
                  className="w-full resize-none rounded-xl border border-[#1D2933] bg-[#080B0F] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-[#475569] focus:border-[#14B8A6]/60"
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {messageText && (
                <div className="rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/5 px-4 py-3 text-sm text-[#5EEAD4]">
                  {messageText}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#14B8A6] px-5 py-3 text-sm font-semibold text-[#04100E] transition hover:bg-[#2DD4BF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Processing with AI..."
                  : "Submit Request"}
              </button>

            </form>
          </section>

          {/* AI RESULT */}
          <section className="rounded-2xl border border-[#1D2933] bg-[#0F141A] p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-base font-semibold">
                  AI Decision
                </h2>

                <p className="mt-1 text-xs text-[#64748B]">
                  AutoOps reasoning result
                </p>
              </div>

              <span className="rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/5 px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-[#14B8A6]">
                AI
              </span>

            </div>

            {!agentResult ? (
              <div className="mt-10 rounded-xl border border-dashed border-[#1D2933] px-4 py-10 text-center">

                <div className="mx-auto h-2 w-2 rounded-full bg-[#14B8A6]" />

                <p className="mt-4 text-sm text-[#64748B]">
                  Submit a request to see the AI decision.
                </p>

              </div>
            ) : (
              <div className="mt-6 space-y-4">

                {/* DECISION */}
                <div className="rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/5 p-4">

                  <p className="text-[9px] uppercase tracking-[0.14em] text-[#64748B]">
                    Decision
                  </p>

                  <p className="mt-2 text-xl font-semibold text-[#14B8A6]">
                    {formatDecision(
                      agentResult.decision
                    )}
                  </p>

                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-2 gap-3">

                  <ResultItem
                    label="Category"
                    value={formatValue(
                      agentResult.category
                    )}
                  />

                  <ResultItem
                    label="Priority"
                    value={formatValue(
                      agentResult.priority
                    )}
                  />

                  <ResultItem
                    label="Confidence"
                    value={
                      typeof agentResult.confidence ===
                      "number"
                        ? `${Math.round(
                            agentResult.confidence * 100
                          )}%`
                        : "—"
                    }
                  />

                  <ResultItem
                    label="Action"
                    value={formatValue(
                      agentResult.action
                    )}
                  />

                </div>

                {/* REASON */}
                <div className="rounded-xl border border-[#1D2933] bg-[#080B0F] p-4">

                  <p className="text-[9px] uppercase tracking-[0.14em] text-[#475569]">
                    Reason
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">
                    {agentResult.reason ||
                      "No reason provided."}
                  </p>

                </div>

                {/* DRAFT */}
                {agentResult.draft_content && (
                  <div className="rounded-xl border border-[#1D2933] bg-[#080B0F] p-4">

                    <p className="text-[9px] uppercase tracking-[0.14em] text-[#475569]">
                      Generated Reply
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">
                      {agentResult.draft_content}
                    </p>

                  </div>
                )}

              </div>
            )}

          </section>

        </div>

        {/* DEMO CASES */}
        <section className="mt-5 rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5">

          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#475569]">
            Demo scenarios
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">

            <DemoCase
              title="Simple Support"
              text="How can I reset my password?"
              expected="Account · Low · Auto-resolve"
            />

            <DemoCase
              title="Billing Escalation"
              text="My card was charged twice for the same subscription."
              expected="Billing · High · Escalate"
            />

            <DemoCase
              title="Qualified Sales"
              text="We are a 50-person company looking for your enterprise plan."
              expected="Qualified Lead · High · Follow-up"
            />

            <DemoCase
              title="Spam"
              text="WIN FREE MONEY!!!"
              expected="Spam · Low · Reject"
            />

          </div>

        </section>

      </div>
    </main>
  );
}


/* =========================================================
   RESULT ITEM
========================================================= */

function ResultItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#1D2933] bg-[#080B0F] p-4">

      <p className="text-[9px] uppercase tracking-[0.12em] text-[#475569]">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-[#E2E8F0]">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   DEMO CASE
========================================================= */

function DemoCase({
  title,
  text,
  expected,
}: {
  title: string;
  text: string;
  expected: string;
}) {
  return (
    <div className="rounded-xl border border-[#1D2933] bg-[#080B0F] p-4">

      <p className="text-xs font-semibold text-[#E2E8F0]">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#64748B]">
        "{text}"
      </p>

      <div className="mt-3 border-t border-[#1D2933] pt-3">

        <span className="text-[9px] uppercase tracking-[0.1em] text-[#475569]">
          Expected
        </span>

        <p className="mt-1 text-xs text-[#14B8A6]">
          {expected}
        </p>

      </div>

    </div>
  );
}