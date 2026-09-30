import { NextResponse } from "next/server";
import { createRequest } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "CSV file is required",
          code: "FILE_REQUIRED",
        },
        { status: 400 }
      );
    }

    const text = await file.text();

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return NextResponse.json(
        {
          error:
            "CSV must contain a header and at least one row",
          code: "INVALID_CSV",
        },
        { status: 400 }
      );
    }

    const headers = lines[0]
      .split(",")
      .map((header) =>
        header.trim().toLowerCase()
      );

    const created = [];

    for (const line of lines.slice(1)) {
      const values = line
        .split(",")
        .map((value) =>
          value.trim().replace(/^"|"$/g, "")
        );

      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] ?? "";
      });

      if (
        !row.name ||
        !row.email ||
        !row.message ||
        !row.type
      ) {
        continue;
      }

      const type =
        row.type.toLowerCase() === "sales"
          ? "sales"
          : "support";

      const request = createRequest({
        id: crypto.randomUUID(),
        name: row.name,
        email: row.email,
        message: row.message,
        type,
        status: "pending",
      });

      created.push(request);
    }

    return NextResponse.json({
      success: true,
      count: created.length,
      requests: created,
    });
  } catch (error) {
    console.error("CSV upload error:", error);

    return NextResponse.json(
      {
        error: "Failed to process CSV",
        code: "CSV_UPLOAD_ERROR",
      },
      { status: 500 }
    );
  }
}