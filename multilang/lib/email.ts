import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      to: email,
      subject: "Votre code de vérification / Your verification code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2>🔐 Verification Required</h2>
          <p>Your OTP code to switch to French:</p>
          <div style="background:#f0f4ff;border-radius:8px;padding:24px;text-align:center;margin:24px 0;">
            <span style="font-size:40px;font-weight:700;letter-spacing:10px;color:#1a1a2e;">${otp}</span>
          </div>
          <p style="color:#666;font-size:14px;">Expires in <strong>5 minutes</strong>. Do not share this code.</p>
        </div>`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
