import { NextResponse } from "next/server";

import { processAgentRequest } from "@/lib/agent/agent";
import {
  addAgentActivity,
  addEscalation,
  addLead,
  getRequest,
  updateRequest,
} from "@/lib/store";

export async function POST(
  _req: Request,
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

    const agentResult = await processAgentRequest({
      name: request.name,
      email: request.email,
      message: request.message,
      type: request.type,
    });

    const now = new Date().toISOString();

    // Save AI decision to the request
    updateRequest(id, {
      category: agentResult.category,
      priority: agentResult.priority,
      confidence: agentResult.confidence,
      decision: agentResult.decision,
      reason: agentResult.reason,
      action: agentResult.action,
      updated_at: now,
    });

    // Agent activity
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

    // ESCALATE
    if (agentResult.decision === "escalate") {
      updateRequest(id, {
        status: "escalated",
        updated_at: now,
      });

      addEscalation({
        id: crypto.randomUUID(),
        request_id: id,
        summary: request.message,
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

    return NextResponse.json({
      success: true,
      request_id: id,
      agent: agentResult,
    });
  } catch (error) {
    console.error(
      "Agent processing error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process request",
        code: "AGENT_PROCESSING_ERROR",
      },
      { status: 500 }
    );
  }
}