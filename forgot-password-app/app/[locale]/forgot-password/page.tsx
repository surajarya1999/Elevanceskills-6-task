"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Step = "email" | "otp" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [copied, setCopied] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address"); return;
    }
    setLoading(true); setError(""); setLimitReached(false);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.limitReached) {
        setLimitReached(true);
        setError("You can use this option only once per day.");
      } else if (data.success) {
        setStep("otp");
        setCooldown(60);
      } else {
        setError(data.message);
      }
    } catch { setError("Network error. Please try again."); }
    setLoading(false);
  };

  // OTP input handling
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };
  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter all 6 digits"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (data.success) {
        setNewPassword(data.newPassword);
        setStep("success");
      } else {
        setError(data.message);
      }
    } catch { setError("Network error. Please try again."); }
    setLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) setCooldown(60);
      else setError(data.message);
    } catch { setError("Network error."); }
    setLoading(false);
  };

  // Copy password
  const handleCopy = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Top bar */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-6 text-white">
            <div className="text-3xl mb-2">
              {step === "email" ? "🔑" : step === "otp" ? "🔐" : "✅"}
            </div>
            <h1 className="text-2xl font-extrabold">
              {step === "email" && "Forgot Password"}
              {step === "otp" && "Verify OTP"}
              {step === "success" && "Password Reset!"}
            </h1>
            <p className="text-red-100 text-sm mt-1">
              {step === "email" && "Enter your registered email to reset your password"}
              {step === "otp" && `Enter the 6-digit code sent to ${email}`}
              {step === "success" && "Your new password has been generated"}
            </p>
          </div>

          <div className="px-8 py-8">

            {/* ── STEP 1: Email ── */}
            {step === "email" && (
              <div className="space-y-5">

                {/* Limit warning */}
                {limitReached && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-amber-800 text-sm">Daily Limit Reached</p>
                      <p className="text-amber-700 text-sm mt-0.5">You can use this option only once per day.</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); setLimitReached(false); }}
                    onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-sm outline-none transition-all
                      ${error && !limitReached ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-red-400 focus:bg-red-50/30"}`}
                  />
                  {error && !limitReached && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading || limitReached}
                  className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending OTP...
                    </span>
                  ) : "Send OTP →"}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Remember your password?{" "}
                  <Link href="/en" className="text-red-500 font-semibold hover:underline">Login</Link>
                </p>

                {/* Info box */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-500 space-y-1">
                  <p>ℹ️ Password reset is allowed <strong>once per day</strong> per email.</p>
                  <p>🔤 Your new password will contain only letters (A-Z, a-z).</p>
                </div>
              </div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === "otp" && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
                  <p className="text-green-700 text-sm font-medium">✅ OTP sent to <strong>{email}</strong></p>
                </div>

                {/* OTP Inputs */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        ref={el => { refs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                          ${d ? "border-red-400 bg-red-50 text-red-700" : "border-gray-200 focus:border-red-400"}`}
                      />
                    ))}
                  </div>
                  {error && <p className="text-center text-red-500 text-sm mt-3">{error}</p>}
                </div>

                {/* Resend */}
                <div className="text-center text-sm">
                  {cooldown > 0 ? (
                    <span className="text-gray-400">Resend in {cooldown}s</span>
                  ) : (
                    <button onClick={handleResend} disabled={loading} className="text-red-500 hover:underline font-medium">
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : "Verify & Reset Password →"}
                </button>

                <button onClick={() => { setStep("email"); setOtp(["","","","","",""]); setError(""); }}
                  className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm">
                  ← Back
                </button>
              </div>
            )}

            {/* ── STEP 3: Success + New Password ── */}
            {step === "success" && (
              <div className="space-y-5">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                  <p className="text-sm text-green-700 mb-3 font-medium">Your new generated password:</p>

                  {/* Password Display */}
                  <div className="bg-white border-2 border-green-300 rounded-xl px-6 py-4 relative">
                    <p className="text-2xl font-bold tracking-widest text-gray-900 font-mono break-all">
                      {newPassword}
                    </p>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    className={`mt-4 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all
                      ${copied ? "bg-green-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                  >
                    {copied ? "✅ Copied!" : "📋 Copy Password"}
                  </button>
                </div>

                {/* Password info */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 space-y-1 text-xs text-blue-700">
                  <p>✅ Contains only letters (A-Z, a-z)</p>
                  <p>✅ No numbers or special characters</p>
                  <p>✅ Also sent to your email: <strong>{email}</strong></p>
                  <p>⚠️ Login and change this password immediately</p>
                </div>

                <Link href="/en"
                  className="block w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl text-center transition-all shadow-md hover:shadow-lg">
                  Go to Login →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Password reset is limited to once per day for security
        </p>
      </div>
    </div>
  );
}
