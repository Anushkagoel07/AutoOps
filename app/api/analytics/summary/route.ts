import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/store";

export async function GET() {
  try {
    const summary = getAnalyticsSummary();

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(
      "Analytics summary error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch analytics summary",
        code: "ANALYTICS_SUMMARY_ERROR",
      },
      { status: 500 }
    );
  }
}