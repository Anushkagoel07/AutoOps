import { NextResponse } from "next/server";

import { processAgentRequest } from "@/lib/agent/agent";
import { executeAction } from "@/lib/agent/actions";

import { createAgentActivity } from "@/lib/store/agentActivity";
import { createEscalation } from "@/lib/store/escalations";
import { createLead } from "@/lib/store/leads";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Request ID is required",
          code: "MISSING_REQUEST_ID",
        },
        { status: 400 }
      );
    }

    
    const requests = result?.data;

    if (!requests || requests.length === 0) {
      return NextResponse.json(
        {
          error: "Request not found",
          code: "REQUEST_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const request = requests[0];

    const agentResult = await processAgentRequest({
      name: request.name,
      email: request.email,
      message: request.message,
      type: request.type,
    });

    const actionResult = executeAction(agentResult);

    const activity = {
      id: crypto.randomUUID(),
      request_id: request.id,
      category: agentResult.category,
      priority: agentResult.priority,
      confidence: agentResult.confidence,
      decision: agentResult.decision,
      reason: agentResult.reason,
      action: agentResult.action,
      created_at: new Date().toISOString(),
    };

    await createAgentActivity(activity);

    let escalation = null;
    let lead = null;

    if (agentResult.decision === "escalate") {
      escalation = {
        id: crypto.randomUUID(),
        request_id: request.id,
        reason: agentResult.reason,
        priority: agentResult.priority,
        status: "open" as const,
        created_at: new Date().toISOString(),
      };

      await createEscalation(escalation);
    }

    if (agentResult.decision === "follow_up") {
      const leadScore = Math.round(
        agentResult.confidence * 100
      );

      lead = {
        id: crypto.randomUUID(),
        request_id: request.id,
        lead_score: leadScore,
        follow_up_status: "sent" as const,
        created_at: new Date().toISOString(),
      };

      await createLead(lead);
    }

    return NextResponse.json({
      success: true,
      request,
      agent: agentResult,
      action: actionResult,
      activity,
      escalation,
      lead,
    });
  } catch (error) {
    console.error("Action execution error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
        code: "ACTION_EXECUTION_ERROR",
      },
      { status: 500 }
    );
  }
}