import { NextResponse } from "next/server";
import { updateEscalation } from "@/lib/store";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const status = body?.status;

    if (
      status !== "pending" &&
      status !== "in_progress" &&
      status !== "resolved"
    ) {
      return NextResponse.json(
        {
          error: "Invalid escalation status",
          code: "INVALID_STATUS",
        },
        { status: 400 }
      );
    }

    // Pass the status string directly
    const updated = updateEscalation(id, status);

    if (!updated) {
      return NextResponse.json(
        {
          error: "Escalation not found",
          code: "ESCALATION_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      escalation: updated,
    });
  } catch (error) {
    console.error("Update escalation error:", error);

    return NextResponse.json(
      {
        error: "Failed to update escalation",
        code: "ESCALATION_UPDATE_ERROR",
      },
      { status: 500 }
    );
  }
}