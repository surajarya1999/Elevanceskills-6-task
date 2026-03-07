import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email: string, otp: string, name: string): Promise<{ success: boolean; error?: string }> {
  const IS_DEV = process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY;

  if (IS_DEV) {
    console.log("\n=============================");
    console.log("🔐 DEV MODE - OTP");
    console.log("📧 Email:", email);
    console.log("🔑 OTP  :", otp);
    console.log("=============================\n");
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      to: email,
      subject: "Resume Payment Verification - OTP",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <h2 style="color:#1e40af;">Hi ${name} 👋</h2>
          <p style="color:#374151;">You are about to pay <strong>₹50</strong> for generating your professional resume.</p>
          <p style="color:#374151;">Your verification code:</p>
          <div style="background:#ffffff;border:2px solid #3b82f6;border-radius:8px;padding:24px;text-align:center;margin:20px 0;">
            <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#1e40af;">${otp}</span>
          </div>
          <p style="color:#6b7280;font-size:13px;">⏱ Expires in <strong>5 minutes</strong>. Do not share this code.</p>
        </div>`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
