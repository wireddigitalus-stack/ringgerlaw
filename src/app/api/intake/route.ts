import { NextRequest, NextResponse } from "next/server";
import { addIntake, getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  return NextResponse.json({ intakes: db.intakes });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = addIntake(body);
    return NextResponse.json({ success: true, intake: created });
  } catch (err) {
    console.error("Failed to save intake:", err);
    return NextResponse.json({ success: false, error: "Failed to save intake record" }, { status: 400 });
  }
}
