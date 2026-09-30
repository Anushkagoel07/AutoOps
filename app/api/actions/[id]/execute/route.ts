import { NextResponse } from "next/server";

import { executeAction } from "@/lib/agent/actions";
import {
  addAgentActivity,
  addEscalation,
  addLead,
  getRequest,
  updateRequest,
} from "@/lib/store";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const request = getRequest(id);

    if (!request) {
      return NextResponse.json(
        {
          error: "Request not found",
          code: "REQUEST_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const agentResult = {
      category: (request.category ?? "general") as
        | "billing"
        | "technical"
        | "account"
        | "general"
        | "spam"
        | "qualified_lead"
        | "potential_lead"
        | "low_intent",

      priority: (request.priority ?? "medium") as
        | "low"
        | "medium"
        | "high"
        | "critical",

      confidence: request.confidence ?? 0,

      decision: (request.decision ?? "escalate") as
        | "auto_resolve"
        | "follow_up"
        | "escalate"
        | "reject",

      reason:
        request.reason ??
        "Request requires further review.",

      action: (request.action ?? "create_human_task") as
        | "send_reply"
        | "send_follow_up"
        | "create_human_task"
        | "archive",

      draft_content: null,
    };

    const result = executeAction(agentResult);

    const now = new Date().toISOString();

    // AUTO RESOLVE
    if (agentResult.decision === "auto_resolve") {
      updateRequest(id, {
        status: "resolved",
        updated_at: now,
      });
    }

    // SALES FOLLOW-UP
    if (agentResult.decision === "follow_up") {
      updateRequest(id, {
        status: "follow_up",
        updated_at: now,
      });

      addLead({
        id: crypto.randomUUID(),
        request_id: id,
        lead_score: Math.round(
          agentResult.confidence * 100
        ),
        follow_up_status: "sent",
        created_at: now,
      });
    }

    // ESCALATION
    if (agentResult.decision === "escalate") {
      updateRequest(id, {
        status: "escalated",
        updated_at: now,
      });

      addEscalation({
        id: crypto.randomUUID(),
        request_id: id,
        summary:
          request.message ??
          "Customer request",
        reason: agentResult.reason,
        suggested_action:
          "Review the request and take appropriate action.",
        status: "pending",
        created_at: now,
      });
    }

    // REJECT / SPAM
    if (agentResult.decision === "reject") {
      updateRequest(id, {
        status: "archived",
        updated_at: now,
      });
    }

    // AGENT ACTIVITY LOG
    addAgentActivity({
      id: crypto.randomUUID(),
      request_id: id,
      category: agentResult.category,
      priority: agentResult.priority,
      confidence: agentResult.confidence,
      decision: agentResult.decision,
      reason: agentResult.reason,
      action: agentResult.action,
      status: "executed",
      created_at: now,
    });

    return NextResponse.json({
      success: true,
      request_id: id,
      result,
    });
  } catch (error) {
    console.error(
      "Action execution error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to execute action",
        code: "ACTION_EXECUTION_ERROR",
      },
      { status: 500 }
    );
  }
}