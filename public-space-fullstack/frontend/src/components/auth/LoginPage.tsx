"use client";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setCurrentUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import API_URL from "@/config/api";

type Step = "login" | "otp";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [demoOTP, setDemoOTP] = useState("");

  const handleLogin = async () => {
    if (!email) { setError("Please enter your email"); return; }
    setLoading(true); setError(""); setInfo("");
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.blocked) { setError(data.message); return; }
    if (!data.success) { setError(data.message); return; }
    if (data.requiresOTP) {
      setStep("otp"); setInfo(data.message);
      if (data.demoOTP) setDemoOTP(data.demoOTP);
      return;
    }
    dispatch(setCurrentUser(data.user));
    router.push("/feed");
  };

  const handleVerifyOTP = async () => {
    if (!otp) { setError("Please enter OTP"); return; }
    setLoading(true); setError("");
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) { setError(data.message); return; }
    dispatch(setCurrentUser(data.user));
    router.push("/feed");
  };

  return (
    <div className="ps-login-page">
      <div className="ps-login-card">
        <div className="ps-login-brand">
          <div className="ps-login-icon">🌐</div>
          <h1 className="ps-login-title">Public<span className="ps-logo-accent">Space</span></h1>
          <p className="ps-login-sub">Sign in to your account</p>
        </div>

        {step === "login" && (
          <>
            <div className="ps-field">
              <label className="ps-label">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter your registered email"
                className="ps-input" />
            </div>
            <div className="ps-security-box">
              <p className="ps-security-title">🔐 Security Rules:</p>
              <p>• Chrome users → OTP verification required</p>
              <p>• Mobile users → Login only 10:00 AM – 1:00 PM</p>
            </div>
            {error && <div className="ps-error">⚠️ {error}</div>}
            <button onClick={handleLogin} disabled={loading} className="ps-btn-primary ps-btn-full">
              {loading ? "Checking..." : "Continue →"}
            </button>
            <div className="ps-demo-box">
              <p className="ps-demo-title">📋 Demo Emails:</p>
              {["arya@demo.com","sofia@demo.com","lucas@demo.com","priya@demo.com","chen@demo.com"].map(e => (
                <button key={e} onClick={() => setEmail(e)} className="ps-demo-email">{e}</button>
              ))}
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="ps-info-box">📧 {info}</div>
            {demoOTP && (
              <div className="ps-otp-demo">
                🧪 <strong>Demo OTP:</strong> <span className="ps-otp-code">{demoOTP}</span>
              </div>
            )}
            <div className="ps-field">
              <label className="ps-label">Enter OTP</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleVerifyOTP()}
                placeholder="6-digit OTP" maxLength={6}
                className="ps-input ps-otp-input" />
            </div>
            {error && <div className="ps-error">⚠️ {error}</div>}
            <button onClick={handleVerifyOTP} disabled={loading} className="ps-btn-primary ps-btn-full">
              {loading ? "Verifying..." : "Verify OTP ✓"}
            </button>
            <button onClick={() => { setStep("login"); setOtp(""); setError(""); setDemoOTP(""); }}
              className="ps-btn-ghost ps-btn-full">← Back</button>
          </>
        )}
      </div>
    </div>
  );
}
