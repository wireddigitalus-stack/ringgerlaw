import { NextRequest, NextResponse } from "next/server";
import { recordTrafficVisitAsync } from "@/lib/db";
import { TrafficChannel } from "@/lib/attribution";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Ignore visits to /admin
    if (typeof body.currentPath === "string" && body.currentPath.startsWith("/admin")) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const summary = await recordTrafficVisitAsync({
      trafficChannel: (body.trafficChannel || "DIRECT") as TrafficChannel,
      trafficSourceLabel: body.trafficSourceLabel || "Direct Visit",
      referrerHost: body.referrerHost || "direct",
      referrerUrl: body.referrerUrl || "",
      landingPage: body.landingPage || "/",
      currentPath: body.currentPath || "/",
      utmSource: body.utmSource || undefined,
      utmMedium: body.utmMedium || undefined,
      utmCampaign: body.utmCampaign || undefined,
      utmTerm: body.utmTerm || undefined,
      clickId: body.clickId || undefined,
      deviceType: body.deviceType || "Desktop",
    });

    return NextResponse.json({ success: true, analytics: summary });
  } catch (err) {
    console.error("Error recording traffic visit:", err);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
