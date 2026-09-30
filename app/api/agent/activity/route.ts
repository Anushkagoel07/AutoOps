import { NextResponse } from "next/server";
import { getAgentActivity } from "@/lib/store";

export async function GET() {
  try {
    const activity = getAgentActivity();

    return NextResponse.json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error("Get agent activity error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch agent activity",
        code: "ACTIVITY_FETCH_ERROR",
      },
      { status: 500 }
    );
  }
}