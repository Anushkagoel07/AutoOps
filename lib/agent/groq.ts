const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not configured");
}

const AGENT_TOOL = {
  type: "function",
  function: {
    name: "analyze_request",
    description:
      "Analyze an AutoOps support request or sales lead and return a structured decision.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: [
            "billing",
            "technical",
            "account",
            "general",
            "spam",
            "qualified_lead",
            "potential_lead",
            "low_intent",
          ],
        },

        priority: {
          type: "string",
          enum: [
            "low",
            "medium",
            "high",
            "critical",
          ],
        },

        confidence: {
          type: "number",
          description: "Confidence score between 0 and 1.",
        },

        decision: {
          type: "string",
          enum: [
            "auto_resolve",
            "follow_up",
            "escalate",
            "reject",
          ],
        },

        reason: {
          type: "string",
          description:
            "A concise human-readable explanation of the decision.",
        },

        action: {
          type: "string",
          enum: [
            "send_reply",
            "send_follow_up",
            "create_human_task",
            "archive",
          ],
        },

        draft_content: {
          type: ["string", "null"],
          description:
            "Reply or follow-up draft when applicable, otherwise null.",
        },
      },

      required: [
        "category",
        "priority",
        "confidence",
        "decision",
        "reason",
        "action",
        "draft_content",
      ],

      additionalProperties: false,
    },
  },
};

export async function callGroq(
  systemPrompt: string,
  userPrompt: string
) {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },

    body: JSON.stringify({
      model: "openai/gpt-oss-120b",

      temperature: 0,

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],

      tools: [AGENT_TOOL],

      tool_choice: {
        type: "function",
        function: {
          name: "analyze_request",
        },
      },
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      `Groq request failed (${response.status}): ${
        data
          ? JSON.stringify(data)
          : "Unknown error"
      }`
    );
  }

  const toolCalls =
    data?.choices?.[0]?.message?.tool_calls;

  if (
    !Array.isArray(toolCalls) ||
    toolCalls.length === 0
  ) {
    throw new Error(
      "Groq did not return a function call"
    );
  }

  const toolCall = toolCalls[0];

  if (
    toolCall?.function?.name !==
    "analyze_request"
  ) {
    throw new Error(
      "Groq returned an unexpected function call"
    );
  }

  const argumentsString =
    toolCall?.function?.arguments;

  if (
    typeof argumentsString !== "string" ||
    !argumentsString
  ) {
    throw new Error(
      "Groq function call arguments are missing"
    );
  }

  try {
    return JSON.parse(argumentsString);
  } catch {
    throw new Error(
      "Groq returned invalid JSON in function arguments"
    );
  }
}