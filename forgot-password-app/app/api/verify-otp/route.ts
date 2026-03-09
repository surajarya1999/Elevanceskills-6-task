import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { generatePassword } from "@/lib/passwordGenerator";
import { sendNewPasswordEmail } from "@/lib/email";
import { markReset } from "@/lib/resetLimit";

const MESSAGES: Record<string, string> = {
  valid: "OTP verified successfully",
  invalid: "Incorrect OTP. Please try again.",
  expired: "OTP expired. Please request a new one.",
  too_many_attempts: "Too many attempts. Please request a new OTP.",
  not_found: "OTP not found. Please request a new one.",
};

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ success: false, message: "Valid email and 6-digit OTP required" }, { status: 400 });
    }

    const result = verifyOtp(email, otp);

    if (result !== "valid") {
      return NextResponse.json({ success: false, message: MESSAGES[result] }, { status: 400 });
    }

    // Generate new password - only letters
    const newPassword = generatePassword(12);

    // Send new password via email
    await sendNewPasswordEmail(email, newPassword);

    // Mark reset used for today
    markReset(email);

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
      newPassword, // send to frontend to display
    });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
