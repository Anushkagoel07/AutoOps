import { NextResponse } from "next/server";
import { createRequest } from "@/lib/store/requests";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "CSV file is required",
          code: "MISSING_FILE",
        },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json(
        {
          error: "Only CSV files are allowed",
          code: "INVALID_FILE_TYPE",
        },
        { status: 400 }
      );
    }

    const csvText = await file.text();

    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return NextResponse.json(
        {
          error: "CSV must contain a header and at least one data row",
          code: "INVALID_CSV",
        },
        { status: 400 }
      );
    }

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().toLowerCase());

    const requiredHeaders = ["name", "email", "message", "type"];

    const hasRequiredHeaders = requiredHeaders.every((header) =>
      headers.includes(header)
    );

    if (!hasRequiredHeaders) {
      return NextResponse.json(
        {
          error: "CSV must contain name, email, message and type columns",
          code: "INVALID_HEADERS",
        },
        { status: 400 }
      );
    }

    const requests = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");

      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || "";
      });

      if (!row.name || !row.email || !row.message || !row.type) {
        return NextResponse.json(
          {
            error: `Invalid data in CSV row ${i + 1}`,
            code: "INVALID_ROW",
          },
          { status: 400 }
        );
      }

      if (row.type !== "support" && row.type !== "sales") {
        return NextResponse.json(
          {
            error: `Invalid type in CSV row ${i + 1}. Use support or sales`,
            code: "INVALID_TYPE",
          },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(row.email)) {
        return NextResponse.json(
          {
            error: `Invalid email in CSV row ${i + 1}`,
            code: "INVALID_EMAIL",
          },
          { status: 400 }
        );
      }

      requests.push({
        id: crypto.randomUUID(),
        name: row.name,
        email: row.email,
        message: row.message,
        type: row.type as "support" | "sales",
        created_at: new Date().toISOString(),
      });
    }

    for (const request of requests) {
      await createRequest(request);
    }

    return NextResponse.json(
      {
        success: true,
        count: requests.length,
        requests,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CSV upload error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        code: "CSV_UPLOAD_ERROR",
      },
      { status: 500 }
    );
  }
}