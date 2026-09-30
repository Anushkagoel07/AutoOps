import { AgentResult } from "./agent";

export interface ActionResult {
  action: AgentResult["action"];
  status: "executed";
  message: string;
  content: string | null;
}

export function executeAction(
  agentResult: AgentResult
): ActionResult {
  switch (agentResult.action) {
    case "send_reply":
      return {
        action: "send_reply",
        status: "executed",
        message: "Reply prepared for the customer.",
        content: agentResult.draft_content,
      };

    case "send_follow_up":
      return {
        action: "send_follow_up",
        status: "executed",
        message: "Sales follow-up prepared.",
        content: agentResult.draft_content,
      };

    case "create_human_task":
      return {
        action: "create_human_task",
        status: "executed",
        message: "Request routed to human review.",
        content: null,
      };

    case "archive":
      return {
        action: "archive",
        status: "executed",
        message: "Request archived as spam.",
        content: null,
      };

    default:
      throw new Error("Unsupported agent action");
  }
}