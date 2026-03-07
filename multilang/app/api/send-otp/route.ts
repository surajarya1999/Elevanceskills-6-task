import { NextRequest, NextResponse } from "next/server";
import { generateOtp, storeOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

const IS_DEV = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Valid email required" }, { status: 400 });
    }

    const otp = generateOtp();
    storeOtp(email, otp);

    // DEV MODE — no API key needed
    if (IS_DEV && !process.env.RESEND_API_KEY) {
      console.log("\n==========================");
      console.log("🔐 DEV MODE OTP");
      console.log("📧 Email:", email);
      console.log("🔑 OTP  :", otp);
      console.log("==========================\n");
      return NextResponse.json({ success: true, message: "OTP sent (check terminal)" });
    }

    const { success, error } = await sendOtpEmail(email, otp);
    if (!success) return NextResponse.json({ success: false, message: "Failed to send email: " + error }, { status: 500 });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
