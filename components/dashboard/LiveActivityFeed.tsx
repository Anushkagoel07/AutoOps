"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: string;
  request_id: string;
  category: string;
  priority: string;
  confidence: number;
  decision: string;
  reason: string;
  action: string;
  created_at: string;
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchActivities() {
    try {
      setError("");

      const response = await fetch("/api/agent/activity");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to fetch activity"
        );
      }

      setActivities(data?.activities || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch activity"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivities();

   
  }, []);

  return (
    <section className="mb-6 rounded-xl border border-gray-800 bg-gray-900">
      <div className="border-b border-gray-800 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Live Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recent AI agent decisions and actions
            </p>
          </div>

          <span className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Live
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-gray-400">
          Loading activity...
        </div>
      ) : error ? (
        <div className="p-6 text-red-400">
          {error}
        </div>
      ) : activities.length === 0 ? (
        <div className="p-6 text-gray-400">
          No agent activity yet.
        </div>
      ) : (
        <div className="divide-y divide-gray-800">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-5 transition hover:bg-gray-800/40"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-white">
                      Request #{activity.request_id}
                    </span>

                    <span className="rounded-full border border-gray-700 px-2 py-1 text-xs text-gray-400">
                      {activity.category}
                    </span>

                    <span className="rounded-full border border-gray-700 px-2 py-1 text-xs text-gray-400">
                      {activity.priority}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-300">
                    {activity.reason}
                  </p>
                </div>

                <span className="whitespace-nowrap text-xs text-gray-500">
                  {new Date(
                    activity.created_at
                  ).toLocaleString()}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                  Decision: {activity.decision}
                </span>

                <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                  Action: {activity.action}
                </span>

                <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                  Confidence:{" "}
                  {Math.round(activity.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}