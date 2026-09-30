import { NextResponse } from "next/server";
import {
  getRequests,
  getEscalations,
  getLeads,
} from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query =
      typeof body?.query === "string"
        ? body.query.trim()
        : "";

    if (!query) {
      return NextResponse.json(
        {
          error: "Analytics query is required",
          code: "INVALID_ANALYTICS_QUERY",
        },
        { status: 400 }
      );
    }

    // Get current AutoOps data
    const requests = getRequests();
    const escalations = getEscalations();
    const leads = getLeads();

    const normalizedQuery = query.toLowerCase();

    let answer = "";

    // -----------------------------------------
    // TOTAL REQUESTS
    // -----------------------------------------
    if (
      normalizedQuery.includes("total requests") ||
      normalizedQuery.includes("how many requests") &&
        !normalizedQuery.includes("escalated") &&
        !normalizedQuery.includes("resolved") &&
        !normalizedQuery.includes("sales") &&
        !normalizedQuery.includes("support")
    ) {
      answer = `AutoOps has received ${requests.length} total requests.`;
    }

    // -----------------------------------------
    // ESCALATED REQUESTS
    // -----------------------------------------
    else if (
      normalizedQuery.includes("escalated") ||
      normalizedQuery.includes("escalation")
    ) {
      answer = `AutoOps has ${escalations.length} escalated request${
        escalations.length === 1 ? "" : "s"
      }.`;
    }

    // -----------------------------------------
    // AUTO-RESOLVED
    // -----------------------------------------
    else if (
      normalizedQuery.includes("auto-resolved") ||
      normalizedQuery.includes("auto resolved") ||
      normalizedQuery.includes("automatically resolved")
    ) {
      const autoResolved = requests.filter(
        (request: any) =>
          request.decision === "auto_resolve" ||
          request.status === "resolved"
      ).length;

      answer = `AutoOps has automatically resolved ${autoResolved} request${
        autoResolved === 1 ? "" : "s"
      }.`;
    }

    // -----------------------------------------
    // FOLLOW-UPS / LEADS
    // -----------------------------------------
    else if (
      normalizedQuery.includes("followed up") ||
      normalizedQuery.includes("follow-up") ||
      normalizedQuery.includes("follow up") ||
      normalizedQuery.includes("leads")
    ) {
      const followUps = leads.filter(
        (lead: any) =>
          lead.follow_up_status === "sent" ||
          lead.follow_up_status === "follow_up_sent"
      ).length;

      answer = `AutoOps has ${
        followUps || leads.length
      } sales lead${
        (followUps || leads.length) === 1 ? "" : "s"
      } recorded for follow-up.`;
    }

    // -----------------------------------------
    // SALES
    // -----------------------------------------
    else if (
      normalizedQuery.includes("sales") ||
      normalizedQuery.includes("sales requests")
    ) {
      const salesRequests = requests.filter(
        (request: any) =>
          request.type === "sales"
      ).length;

      answer = `AutoOps has received ${salesRequests} sales request${
        salesRequests === 1 ? "" : "s"
      }.`;
    }

    // -----------------------------------------
    // SUPPORT
    // -----------------------------------------
    else if (
      normalizedQuery.includes("support") ||
      normalizedQuery.includes("support requests")
    ) {
      const supportRequests = requests.filter(
        (request: any) =>
          request.type === "support"
      ).length;

      answer = `AutoOps has received ${supportRequests} support request${
        supportRequests === 1 ? "" : "s"
      }.`;
    }

    // -----------------------------------------
    // BILLING
    // -----------------------------------------
    else if (
      normalizedQuery.includes("billing")
    ) {
      const billingRequests = requests.filter(
        (request: any) =>
          request.category === "billing"
      ).length;

      answer = `AutoOps has received ${billingRequests} billing request${
        billingRequests === 1 ? "" : "s"
      }.`;
    }

    // -----------------------------------------
    // SPAM
    // -----------------------------------------
    else if (
      normalizedQuery.includes("spam")
    ) {
      const spamRequests = requests.filter(
        (request: any) =>
          request.category === "spam" ||
          request.decision === "reject"
      ).length;

      answer = `AutoOps has filtered ${spamRequests} spam request${
        spamRequests === 1 ? "" : "s"
      }.`;
    }

    // -----------------------------------------
    // ESCALATION PERCENTAGE
    // -----------------------------------------
    else if (
      normalizedQuery.includes("percentage") &&
      normalizedQuery.includes("escalat")
    ) {
      const percentage =
        requests.length === 0
          ? 0
          : Math.round(
              (escalations.length / requests.length) *
                100
            );

      answer = `${percentage}% of AutoOps requests have been escalated.`;
    }

    // -----------------------------------------
    // RESOLUTION RATE
    // -----------------------------------------
    else if (
      normalizedQuery.includes("resolution rate") ||
      normalizedQuery.includes("resolved percentage")
    ) {
      const resolved = requests.filter(
        (request: any) =>
          request.decision === "auto_resolve" ||
          request.status === "resolved"
      ).length;

      const rate =
        requests.length === 0
          ? 0
          : Math.round(
              (resolved / requests.length) * 100
            );

      answer = `The current automatic resolution rate is ${rate}%.`;
    }

    // -----------------------------------------
    // FALLBACK
    // -----------------------------------------
    else {
      answer =
        `I found ${requests.length} total requests, ` +
        `${escalations.length} escalations, and ` +
        `${leads.length} sales leads in AutoOps.`;
    }

    return NextResponse.json({
      success: true,
      query,
      result: answer,
    });
  } catch (error) {
    console.error(
      "Analytics query error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Analytics query failed",
        code: "ANALYTICS_QUERY_ERROR",
      },
      { status: 500 }
    );
  }
}