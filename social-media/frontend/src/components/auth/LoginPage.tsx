"use client";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setCurrentUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // Step 1: Firebase Google popup
      const result = await signInWithPopup(auth, provider);
      const { displayName, email: userEmail, photoURL } = result.user;

      // Step 2: Backend ko bhejo — device/browser/IP check ke liye
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          email: userEmail,
          avatar: photoURL,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.blocked) {
        setError(data.message);
        return;
      }

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Chrome hai → OTP step
      if (data.requiresOTP) {
        setEmail(userEmail!);
        setInfo(data.message);
        setStep("otp");
        return;
      }

      // Non-Chrome → seedha feed
      dispatch(setCurrentUser(data.user));
      router.push("/feed");

    } catch (err: any) {
      setLoading(false);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Login cancel kar diya. Dobara try karo.");
      } else {
        setError("Google login failed. Dobara try karo.");
      }
      console.error(err);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) { setError("OTP daalo"); return; }
    setLoading(true);
    setError("");

    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.message);
      return;
    }

    dispatch(setCurrentUser(data.user));
    router.push("/feed");
  };

  return (
    <div className="ps-login-page">
      <div className="ps-login-card">

        <div className="ps-login-brand">
          <div className="ps-login-icon">🌐</div>
          <h1 className="ps-login-title">
            Public<span className="ps-logo-accent">Space</span>
          </h1>
          <p className="ps-login-sub">Sign in to your account</p>
        </div>

        {step === "login" && (
          <>
            <div className="ps-security-box">
              <p className="ps-security-title">🔐 Security Rules:</p>
              <p>• Chrome users → OTP verification required</p>
              <p>• Mobile users → Login only 10:00 AM – 1:00 PM</p>
            </div>

            {error && <div className="ps-error">⚠️ {error}</div>}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="ps-btn-google ps-btn-full"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                width={20}
                height={20}
                alt="Google"
              />
              {loading ? "Connecting..." : "Continue with Google"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="ps-info-box">📧 {info}</div>
            <div className="ps-field">
              <label className="ps-label">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                placeholder="6-digit OTP"
                maxLength={6}
                className="ps-input ps-otp-input"
              />
            </div>
            {error && <div className="ps-error">⚠️ {error}</div>}
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="ps-btn-primary ps-btn-full"
            >
              {loading ? "Verifying..." : "Verify OTP ✓"}
            </button>
            <button
              onClick={() => { setStep("login"); setOtp(""); setError(""); }}
              className="ps-btn-ghost ps-btn-full"
            >
              ← Back
            </button>
          </>
        )}

      </div>
    </div>
  );
}
