import { NextRequest, NextResponse } from "next/server";
import { generateOtp, storeOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { canReset } from "@/lib/resetLimit";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Valid email required" }, { status: 400 });
    }

    // Check daily limit
    if (!canReset(email)) {
      return NextResponse.json({
        success: false,
        limitReached: true,
        message: "You can use this option only once per day.",
      }, { status: 429 });
    }

    const otp = generateOtp();
    storeOtp(email, otp);

    const { success, error } = await sendOtpEmail(email, otp);
    if (!success) return NextResponse.json({ success: false, message: error ?? "Failed to send email" }, { status: 500 });

    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
