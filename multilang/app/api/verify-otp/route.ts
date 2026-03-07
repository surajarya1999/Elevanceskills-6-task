import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";

const MESSAGES: Record<string, string> = {
  valid: "Verified successfully",
  invalid: "Incorrect code. Try again.",
  expired: "Code expired. Request a new one.",
  too_many_attempts: "Too many attempts. Request a new code.",
  not_found: "No code found. Please request a new one.",
};

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ success: false, message: "Valid email and 6-digit OTP required" }, { status: 400 });
    }
    const result = verifyOtp(email, otp);
    const success = result === "valid";
    return NextResponse.json({ success, message: MESSAGES[result] }, { status: success ? 200 : 400 });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
