import { NextRequest, NextResponse } from "next/server";
import {
  addLeadAsync,
  deleteLeadAsync,
  getDbAsync,
  resetAllDataAsync,
  updateLeadStatusAsync,
  LeadStatus,
} from "@/lib/db";
import { sendNewLeadNotification } from "@/lib/email-notifications";

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({
    leads: db.leads,
    intakes: db.intakes,
    analytics: db.analytics,
    storageEngine: db.storageEngine,
    supabaseUrl: db.supabaseUrl,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await addLeadAsync({
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
      captureMethod: body.captureMethod || "Free Consultation Form",
      preferredDate: body.preferredDate || "",
      preferredTime: body.preferredTime || "",
      notes: body.notes || "",
      trafficChannel: body.trafficChannel || "DIRECT",
      trafficSourceLabel: body.trafficSourceLabel || "Direct Visit",
      referrerUrl: body.referrerUrl || "",
      landingPage: body.landingPage || body.sourcePage || "/",
      utmSource: body.utmSource || "",
      utmMedium: body.utmMedium || "",
      utmCampaign: body.utmCampaign || "",
      utmTerm: body.utmTerm || "",
      clickId: body.clickId || "",
      deviceType: body.deviceType || "Desktop",
    });

    await sendNewLeadNotification(created);

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
    const updated = await updateLeadStatusAsync(id, status, notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, lead: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.resetAll) {
      await resetAllDataAsync();
      return NextResponse.json({ success: true, reset: true });
    }
    if (body.id) {
      await deleteLeadAsync(String(body.id));
      return NextResponse.json({ success: true, deletedId: body.id });
    }
    return NextResponse.json({ success: false, error: "Missing id or resetAll" }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 400 });
  }
}
