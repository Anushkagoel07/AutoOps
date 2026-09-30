import { NextResponse } from "next/server";
import {
  createRequest,
  getRequests,
} from "@/lib/store";

type RequestType = "support" | "sales";

interface IntakeRequest {
  name: string;
  email: string;
  message: string;
  type: RequestType;
}

export async function GET() {
  try {
    const requests = getRequests();

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get requests error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch requests",
        code: "REQUESTS_FETCH_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<IntakeRequest>;

    const { name, email, message, type } = body;

    if (!name || !email || !message || !type) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    if (type !== "support" && type !== "sales") {
      return NextResponse.json(
        {
          error: "Type must be either support or sales",
          code: "INVALID_TYPE",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Invalid email address",
          code: "INVALID_EMAIL",
        },
        { status: 400 }
      );
    }

    const requestData = {
      id: `req_${Date.now()}`,
      name,
      email,
      message,
      type,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const request = createRequest(requestData);

    return NextResponse.json(
      {
        success: true,
        request,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create request error:", error);

    return NextResponse.json(
      {
        error: "Failed to create request",
        code: "REQUEST_CREATE_ERROR",
      },
      { status: 500 }
    );
  }
}