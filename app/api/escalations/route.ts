import { NextResponse } from "next/server";
import { getEscalations } from "@/lib/store";

export async function GET() {
  try {
    const escalations = getEscalations();

    return NextResponse.json({
      success: true,
      escalations,
    });
  } catch (error) {
    console.error("Get escalations error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch escalations",
        code: "ESCALATIONS_FETCH_ERROR",
      },
      { status: 500 }
    );
  }
}