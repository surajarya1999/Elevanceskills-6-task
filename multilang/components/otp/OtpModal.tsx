"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/types";

interface OtpModalProps {
  isOpen: boolean;
  targetLocale: Locale;
  currentPath: string;
  onClose: () => void;
}

export default function OtpModal({ isOpen, targetLocale, currentPath, onClose }: OtpModalProps) {
  const t = useTranslations("otp");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) { setStep("email"); setEmail(""); setOtp(["","","","","",""]); setError(""); }
  }, [isOpen]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // After success — redirect using window.location
  useEffect(() => {
    if (step !== "success") return;
    const timer = setTimeout(() => {
      const parts = currentPath.split("/");
      parts[1] = targetLocale;
      window.location.href = parts.join("/");
    }, 1000);
    return () => clearTimeout(timer);
  }, [step, currentPath, targetLocale]);

  const handleSend = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email"); return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) { setStep("code"); setCooldown(60); }
      else setError(data.message);
    } catch { setError("Network error. Try again."); }
    setLoading(false);
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter all 6 digits"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (data.success) setStep("success");
      else setError(data.message);
    } catch { setError("Network error. Try again."); }
    setLoading(false);
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">🔐 {t("title")}</h2>
            <p className="text-sm text-gray-500 mt-1">{t("desc")}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* Success */}
        {step === "success" && (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">✅</div>
            <p className="font-bold text-green-600 text-lg">{t("success")}</p>
            <p className="text-gray-400 text-sm mt-2">Redirecting...</p>
          </div>
        )}

        {/* Step 1: Email */}
        {step === "email" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("emailLabel")}</label>
              <input
                type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">{t("cancel")}</button>
              <button onClick={handleSend} disabled={loading}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold">
                {loading ? t("sending") : t("sendCode")}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === "code" && (
          <div className="space-y-5">
            <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">{t("codeSentTo", { email })}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t("codeLabel")}</label>
              <div className="flex gap-2">
                {otp.map((d, i) => (
                  <input key={i} ref={el => { inputRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-lg border-2 outline-none transition-all
                      ${d ? "border-blue-500 bg-blue-50" : "border-gray-200 focus:border-blue-400"}`}
                  />
                ))}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="text-center text-sm">
              {cooldown > 0
                ? <span className="text-gray-400">{t("resendIn", { seconds: cooldown })}</span>
                : <button onClick={handleSend} disabled={loading} className="text-blue-600 hover:underline">{t("resend")}</button>
              }
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">{t("cancel")}</button>
              <button onClick={handleVerify} disabled={loading || otp.join("").length !== 6}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold">
                {loading ? t("verifying") : t("verify")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
