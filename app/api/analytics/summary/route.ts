import { NextResponse } from "next/server";


export async function GET() {
  try {
    

    const requests = result?.data || [];

    const totalRequests = requests.length;

    const autoResolved = requests.filter(
      (request: any) =>
        request.decision === "auto_resolve"
    ).length;

    const followUps = requests.filter(
      (request: any) =>
        request.decision === "follow_up"
    ).length;

    const escalations = requests.filter(
      (request: any) =>
        request.decision === "escalate"
    ).length;

    const spamFiltered = requests.filter(
      (request: any) =>
        request.decision === "reject" ||
        request.category === "spam"
    ).length;

    const resolutionRate =
      totalRequests > 0
        ? Math.round(
            (autoResolved / totalRequests) * 100
          )
        : 0;

    return NextResponse.json({
      success: true,
      summary: {
        totalRequests,
        autoResolved,
        followUps,
        escalations,
        spamFiltered,
        resolutionRate,
      },
    });
  } catch (error) {
    console.error("Analytics summary error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
        code: "ANALYTICS_SUMMARY_ERROR",
      },
      { status: 500 }
    );
  }
}