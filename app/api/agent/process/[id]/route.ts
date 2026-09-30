import { NextResponse } from "next/server";
import { getRequest, updateRequest, addAgentActivity, addEscalation } from "@/lib/store";
import { processAgentRequest } from "@/lib/agent/agent";
import { executeAction } from "@/lib/agent/actions";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    // 1. Get request
    const requestData = getRequest(id);

    if (!requestData) {
      return NextResponse.json(
        {
          error: "Request not found",
          code: "REQUEST_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // 2. Run AI agent
    const agentResult = await processAgentRequest({
      id: requestData.id,
      name: requestData.name,
      email: requestData.email,
      message: requestData.message,
      type: requestData.type,
    });

    // 3. Execute action
    const actionResult = executeAction(agentResult);

    // 4. Update request with AI result
    updateRequest(id, {
      category: agentResult.category,
      priority: agentResult.priority,
      confidence: agentResult.confidence,
      decision: agentResult.decision,
      reason: agentResult.reason,
      action: agentResult.action,
      draft_content: agentResult.draft_content ?? null,
      status: actionResult.status,
      updated_at: new Date().toISOString(),
    });

    // 5. Log agent activity
    addAgentActivity({
      id: crypto.randomUUID(),
      request_id: id,
      category: agentResult.category,
      priority: agentResult.priority,
      confidence: agentResult.confidence,
      decision: agentResult.decision,
      reason: agentResult.reason,
      action: agentResult.action,
      status: actionResult.status,
      created_at: new Date().toISOString(),
    });

    // 6. Create escalation when required
    if (agentResult.decision === "escalate") {
      addEscalation({
        id: crypto.randomUUID(),
        request_id: id,
        summary: requestData.message,
        reason: agentResult.reason,
        suggested_action:
          agentResult.draft_content ||
          "Human review required.",
        status: "pending",
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      request_id: id,
      agent: agentResult,
      action: actionResult,
    });
  } catch (error) {
    console.error("Agent processing error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Agent processing failed",
        code: "AGENT_PROCESSING_ERROR",
      },
      { status: 500 }
    );
  }
}