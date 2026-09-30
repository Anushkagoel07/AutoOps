import { callGroq } from "./groq";

export interface AgentInput {
  name: string;
  email: string;
  message: string;
  type: "support" | "sales";
}

export interface AgentResult {
  category:
    | "billing"
    | "technical"
    | "account"
    | "general"
    | "spam"
    | "qualified_lead"
    | "potential_lead"
    | "low_intent";

  priority: "low" | "medium" | "high" | "critical";

  confidence: number;

  decision:
    | "auto_resolve"
    | "follow_up"
    | "escalate"
    | "reject";

  reason: string;

  action:
    | "send_reply"
    | "send_follow_up"
    | "create_human_task"
    | "archive";

  draft_content: string | null;
}

const VALID_CATEGORIES = [
  "billing",
  "technical",
  "account",
  "general",
  "spam",
  "qualified_lead",
  "potential_lead",
  "low_intent",
];

const VALID_PRIORITIES = [
  "low",
  "medium",
  "high",
  "critical",
];

const VALID_DECISIONS = [
  "auto_resolve",
  "follow_up",
  "escalate",
  "reject",
];

const VALID_ACTIONS = [
  "send_reply",
  "send_follow_up",
  "create_human_task",
  "archive",
];

const SYSTEM_PROMPT = `
You are the autonomous AI agent for AutoOps.

Analyze one incoming business request and return the structured decision through the analyze_request function.

For every request:
- classify the request
- determine priority
- assign confidence from 0 to 1
- make a decision
- provide a one-sentence reason
- determine the action
- provide draft_content when appropriate

SUPPORT CATEGORIES:
billing, technical, account, general, spam

SALES CATEGORIES:
qualified_lead, potential_lead, low_intent, spam

PRIORITIES:
low, medium, high, critical

DECISIONS:
auto_resolve, follow_up, escalate, reject

ACTIONS:
send_reply, send_follow_up, create_human_task, archive

RULES:

1. Auto-resolve only when the request is clear and low ambiguity.
   Generally require confidence >= 0.8.

2. Escalate when:
   - there is a money dispute
   - the customer is angry or frustrated
   - there is a legal or compliance issue
   - there are duplicate charges
   - confidence is below 0.6

3. Follow_up only for genuine sales intent, such as:
   - company size
   - budget
   - paid plan
   - enterprise plan interest

4. Reject obvious spam.

5. Auto-resolve:
   action = send_reply
   draft_content = proposed reply

6. Follow-up:
   action = send_follow_up
   draft_content = proposed follow-up

7. Escalate:
   action = create_human_task
   draft_content = null

8. Reject:
   action = archive
   draft_content = null

9. Confidence must be between 0 and 1.

Use the analyze_request function with the required fields.
`;

function validationFailure(): AgentResult {
  return {
    category: "general",
    priority: "high",
    confidence: 0,
    decision: "escalate",
    reason:
      "Low confidence / validation failure — routed to human review",
    action: "create_human_task",
    draft_content: null,
  };
}

function validateAgentResult(
  result: unknown
): AgentResult {
  if (!result || typeof result !== "object") {
    return validationFailure();
  }

  const data = result as Record<string, unknown>;

  const validCategory =
    typeof data.category === "string" &&
    VALID_CATEGORIES.includes(data.category);

  const validPriority =
    typeof data.priority === "string" &&
    VALID_PRIORITIES.includes(data.priority);

  const validConfidence =
    typeof data.confidence === "number" &&
    data.confidence >= 0 &&
    data.confidence <= 1;

  const validDecision =
    typeof data.decision === "string" &&
    VALID_DECISIONS.includes(data.decision);

  const validReason =
    typeof data.reason === "string" &&
    data.reason.trim().length > 0;

  const validAction =
    typeof data.action === "string" &&
    VALID_ACTIONS.includes(data.action);

  const validDraftContent =
    data.draft_content === null ||
    typeof data.draft_content === "string";

  if (
    !validCategory ||
    !validPriority ||
    !validConfidence ||
    !validDecision ||
    !validReason ||
    !validAction ||
    !validDraftContent
  ) {
    return validationFailure();
  }

  // TypeScript fix
  const agentResult =
    data as unknown as AgentResult;

  if (agentResult.confidence < 0.5) {
    return {
      ...agentResult,
      decision: "escalate",
      action: "create_human_task",
      reason: `Low confidence — ${agentResult.reason}`,
      draft_content: null,
    };
  }

  if (agentResult.confidence < 0.6) {
    return {
      ...agentResult,
      decision: "escalate",
      action: "create_human_task",
      draft_content: null,
    };
  }

  return agentResult;
}

export async function processAgentRequest(
  input: AgentInput
): Promise<AgentResult> {
  const userPrompt = `
Analyze this AutoOps request.

Name: ${input.name}
Email: ${input.email}
Type: ${input.type}
Message: ${input.message}
`;

  try {
    const result = await callGroq(
      SYSTEM_PROMPT,
      userPrompt
    );

    return validateAgentResult(result);
  } catch (firstError) {
    console.error(
      "Groq first attempt failed:",
      firstError
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 1500)
    );

    try {
      const retryResult = await callGroq(
        SYSTEM_PROMPT,
        userPrompt
      );

      return validateAgentResult(retryResult);
    } catch (secondError) {
      console.error(
        "Groq retry failed:",
        secondError
      );

      return {
        category: "general",
        priority: "high",
        confidence: 0,
        decision: "escalate",
        reason:
          "AI service unavailable — routed to human review",
        action: "create_human_task",
        draft_content: null,
      };
    }
  }
}