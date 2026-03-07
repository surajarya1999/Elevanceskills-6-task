import { NextRequest, NextResponse } from "next/server";
import { generateOtp, storeOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Valid email required" }, { status: 400 });
    }
    const otp = generateOtp();
    storeOtp(email, otp);
    const { success, error } = await sendOtpEmail(email, otp, name ?? "Student");
    if (!success) return NextResponse.json({ success: false, message: error ?? "Failed to send email" }, { status: 500 });
    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
