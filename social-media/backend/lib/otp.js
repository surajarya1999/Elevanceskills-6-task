const nodemailer = require("nodemailer");

// In-memory OTP store (use Redis in production)
const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
}

function verifyOTP(email, otp) {
  const record = otpStore.get(email);
  if (!record) return false;
  if (Date.now() > record.expiresAt) { otpStore.delete(email); return false; }
  if (record.otp !== otp) return false;
  otpStore.delete(email);
  return true;
}

async function sendOTPEmail(email, otp, name) {
  console.log("📧 Sending OTP to:", email);
  console.log("🔑 EMAIL_USER:", process.env.EMAIL_USER);
  console.log("✅ OTP is:", otp);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"Public Space" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Login OTP — Public Space",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#1d4ed8">🔐 Login Verification</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>You're logging in via <strong>Google Chrome</strong>. Use the OTP below:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1d4ed8;padding:16px 0">${otp}</div>
        <p style="color:#6b7280;font-size:13px">Valid for <strong>5 minutes</strong>. Do not share it.</p>
      </div>
    `,
  });
}

module.exports = { generateOTP, storeOTP, verifyOTP, sendOTPEmail };
