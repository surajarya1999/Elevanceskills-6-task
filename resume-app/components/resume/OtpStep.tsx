"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setOtpVerified, setStep } from "@/store/slices/resumeSlice";

export default function OtpStep() {
  const t = useTranslations("resume.otp");
  const dispatch = useAppDispatch();
  const formData = useAppSelector(s => s.resume.formData);
  const email = formData?.email ?? "";
  const name = formData?.name ?? "";

  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendOtp = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (data.success) { setSent(true); setCooldown(60); }
      else setError(data.message);
    } catch { setError("Network error. Try again."); }
    setLoading(false);
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter all 6 digits"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (data.success) dispatch(setOtpVerified());
      else setError(data.message);
    } catch { setError("Network error. Try again."); }
    setLoading(false);
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
          <p className="text-gray-500 text-sm mt-2">{t("desc")}</p>
          <p className="text-blue-600 font-medium text-sm mt-1">{email}</p>
        </div>

        {!sent ? (
          <div className="space-y-4">
            <button onClick={sendOtp} disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
              {loading ? t("sending") : t("send")}
            </button>
            <button onClick={() => dispatch(setStep("form"))}
              className="w-full py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm transition-colors">
              {t("cancel")}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-center text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              ✅ {t("codeSentTo", { email })}
            </p>
            <div className="flex gap-2 justify-center">
              {otp.map((d, i) => (
                <input key={i} ref={el => { refs.current[i] = el; }}
                  type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleKey(i, e)}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                    ${d ? "border-blue-500 bg-blue-50" : "border-gray-200 focus:border-blue-400"}`}
                />
              ))}
            </div>
            {error && <p className="text-center text-sm text-red-500">{error}</p>}
            <div className="text-center text-sm">
              {cooldown > 0
                ? <span className="text-gray-400">{t("resendIn", { seconds: cooldown })}</span>
                : <button onClick={sendOtp} disabled={loading} className="text-blue-600 hover:underline">{t("resend")}</button>
              }
            </div>
            <button onClick={verifyOtp} disabled={loading || otp.join("").length !== 6}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
              {loading ? t("verifying") : t("verify")}
            </button>
            <button onClick={() => dispatch(setStep("form"))}
              className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm">{t("cancel")}</button>
          </div>
        )}
      </div>
    </div>
  );
}
