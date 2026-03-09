import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(
  email: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  const IS_DEV = !process.env.RESEND_API_KEY;

  if (IS_DEV) {
    console.log("\n================================");
    console.log("🔐 DEV MODE - Forgot Password OTP");
    console.log("📧 Email :", email);
    console.log("🔑 OTP   :", otp);
    console.log("================================\n");
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      to: email,
      subject: "Password Reset - OTP Verification",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <h2 style="color:#dc2626;">🔑 Password Reset Request</h2>
          <p style="color:#374151;">We received a request to reset your password. Use the code below:</p>
          <div style="background:#fff;border:2px solid #ef4444;border-radius:8px;padding:24px;text-align:center;margin:20px 0;">
            <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#dc2626;">${otp}</span>
          </div>
          <p style="color:#6b7280;font-size:13px;">⏱ Expires in <strong>5 minutes</strong>.</p>
          <p style="color:#6b7280;font-size:13px;">If you did not request this, please ignore this email.</p>
        </div>`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendNewPasswordEmail(
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const IS_DEV = !process.env.RESEND_API_KEY;

  if (IS_DEV) {
    console.log("\n================================");
    console.log("🔑 DEV MODE - New Password");
    console.log("📧 Email    :", email);
    console.log("🔐 Password :", newPassword);
    console.log("================================\n");
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      to: email,
      subject: "Your New Password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <h2 style="color:#16a34a;">✅ Password Reset Successful</h2>
          <p style="color:#374151;">Your new password is:</p>
          <div style="background:#fff;border:2px solid #22c55e;border-radius:8px;padding:24px;text-align:center;margin:20px 0;">
            <span style="font-size:28px;font-weight:800;letter-spacing:4px;color:#15803d;font-family:monospace;">${newPassword}</span>
          </div>
          <p style="color:#6b7280;font-size:13px;">Please login and change this password immediately.</p>
        </div>`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
