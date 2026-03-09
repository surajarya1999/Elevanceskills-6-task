import { NextRequest, NextResponse } from "next/server";
import { canReset } from "@/lib/resetLimit";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });

    const allowed = canReset(email);
    if (!allowed) {
      return NextResponse.json({
        success: false,
        limitReached: true,
        message: "You can use this option only once per day.",
      }, { status: 429 });
    }

    return NextResponse.json({ success: true, message: "Allowed" });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
