import { NextRequest, NextResponse } from "next/server";
import { addIntakeAsync, getDbAsync } from "@/lib/db";
import { sendNewIntakeNotification } from "@/lib/email-notifications";

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json({
    intakes: db.intakes,
    storageEngine: db.storageEngine,
    supabaseUrl: db.supabaseUrl,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await addIntakeAsync(body);
    await sendNewIntakeNotification(created);
    return NextResponse.json({ success: true, intake: created });
  } catch (err) {
    console.error("Failed to save intake:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save intake record" },
      { status: 400 }
    );
  }
}
