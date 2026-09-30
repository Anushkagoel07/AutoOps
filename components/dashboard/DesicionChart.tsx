"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DecisionChartProps {
  requests: {
    decision?: string;
  }[];
}

export default function DecisionChart({
  requests,
}: DecisionChartProps) {
  const data = [
    {
      name: "Resolve",
      value: requests.filter(
        (item) => item.decision === "auto_resolve"
      ).length,
    },
    {
      name: "Follow-up",
      value: requests.filter(
        (item) => item.decision === "follow_up"
      ).length,
    },
    {
      name: "Escalate",
      value: requests.filter(
        (item) => item.decision === "escalate"
      ).length,
    },
    {
      name: "Reject",
      value: requests.filter(
        (item) => item.decision === "reject"
      ).length,
    },
  ];

  const hasData = data.some(
    (item) => item.value > 0
  );

  return (
    <div className="rounded-2xl border border-[#1D2933] bg-[#0F141A] p-5">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-semibold text-white">
            Decision Distribution
          </p>

          <p className="mt-1 text-xs text-[#475569]">
            How the AI agent is routing requests
          </p>
        </div>

        <span className="rounded-lg border border-[#1D2933] bg-black/20 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] text-[#64748B]">
          AI Decisions
        </span>

      </div>

      {!hasData ? (
        <div className="flex h-[250px] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#1D2933] text-[#475569]">
              —
            </div>

            <p className="mt-3 text-xs text-[#64748B]">
              Waiting for AI decisions
            </p>

            <p className="mt-1 text-[10px] text-[#334155]">
              Decision data will appear here automatically.
            </p>

          </div>

        </div>
      ) : (
        <div className="mt-5 h-[250px] w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 5,
              }}
            >

              <CartesianGrid
                stroke="#1D2933"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#64748B",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#475569",
                  fontSize: 9,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(255,255,255,0.02)",
                }}
                contentStyle={{
                  background: "#0A0F14",
                  border: "1px solid #1D2933",
                  borderRadius: "10px",
                  color: "#F1F5F9",
                  fontSize: "11px",
                }}
              />

              <Bar
                dataKey="value"
                fill="#14B8A6"
                radius={[5, 5, 0, 0]}
                maxBarSize={42}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>
      )}

    </div>
  );
}