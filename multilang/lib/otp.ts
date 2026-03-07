import crypto from "crypto";

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const otpStore = new Map<string, { hash: string; expires: number; attempts: number }>();

export function generateOtp(): string {
  const buffer = crypto.randomBytes(3);
  return ((buffer.readUIntBE(0, 3) % 900000) + 100000).toString();
}

function hashOtp(otp: string, email: string): string {
  return crypto.createHmac("sha256", process.env.OTP_SECRET ?? "dev-secret")
    .update(`${otp}:${email.toLowerCase()}`).digest("hex");
}

export function storeOtp(email: string, otp: string): void {
  otpStore.set(email.toLowerCase(), {
    hash: hashOtp(otp, email),
    expires: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  });
}

export type VerifyResult = "valid" | "invalid" | "expired" | "too_many_attempts" | "not_found";

export function verifyOtp(email: string, otp: string): VerifyResult {
  const key = email.toLowerCase();
  const record = otpStore.get(key);
  if (!record) return "not_found";
  if (Date.now() > record.expires) { otpStore.delete(key); return "expired"; }
  if (record.attempts >= MAX_ATTEMPTS) { otpStore.delete(key); return "too_many_attempts"; }
  const isValid = crypto.timingSafeEqual(Buffer.from(hashOtp(otp, email)), Buffer.from(record.hash));
  if (isValid) { otpStore.delete(key); return "valid"; }
  record.attempts += 1;
  return "invalid";
}
