import { NextRequest, NextResponse } from "next/server";
import { addLead, getDb, saveDb, LeadStatus } from "@/lib/db";

export async function GET() {
  const db = getDb();
  return NextResponse.json({
    leads: db.leads,
    intakes: db.intakes,
    analytics: db.analytics,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = addLead({
      firstName: body.firstName || "Prospective Client",
      lastName: body.lastName || "",
      phone: body.phone || "",
      email: body.email || "",
      county: body.county || "Madison County (Jackson)",
      primaryConcern: body.primaryConcern || "Eliminate Credit Card & Medical Debt",
      estimatedDebt: Number(body.estimatedDebt) || 25000,
      ownsHome: Boolean(body.ownsHome),
      behindOnPayments: Boolean(body.behindOnPayments),
      sourcePage: body.sourcePage || "/",
      captureMethod: body.captureMethod || "60-Sec Qualifier Quiz",
      preferredDate: body.preferredDate || "",
      preferredTime: body.preferredTime || "",
      notes: body.notes || "",
    });
    return NextResponse.json({ success: true, lead: created });
  } catch (err) {
    console.error("Error saving lead:", err);
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body as { id: string; status?: LeadStatus; notes?: string };
    const db = getDb();
    const lead = db.leads.find((l) => l.id === id);
    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }
    if (status) lead.status = status;
    if (typeof notes === "string") lead.notes = notes;
    saveDb(db);
    return NextResponse.json({ success: true, lead });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 400 });
  }
}
