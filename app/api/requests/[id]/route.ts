import { NextResponse } from "next/server";
import { getRequest } from "@/lib/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const request = getRequest(id);

    if (!request) {
      return NextResponse.json(
        {
          error: "Request not found",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Get request error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch request",
        code: "REQUEST_FETCH_ERROR",
      },
      { status: 500 }
    );
  }
}