"use client";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setCurrentUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import API_URL from "@/config/api";

export default function EntryPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!name.trim()) { setError("Please enter your name"); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); setLoading(false); return; }
      dispatch(setCurrentUser(data.user));
      router.push("/dashboard");
    } catch {
      setError("Cannot connect to backend. Make sure backend is running on port 5000.");
    }
    setLoading(false);
  };

  return (
    <div className="entry-pg">
      <div className="entry-card">
        <div className="entry-icon">💼</div>
        <h1 className="entry-title">Internship<span className="accent">Hub</span></h1>
        <p className="entry-sub">Enter your details to get started</p>

        <div className="field">
          <label className="lbl">Your Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleStart()}
            placeholder="e.g. Arya Sharma"
            className="inp" />
        </div>

        <div className="field">
          <label className="lbl">Your Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleStart()}
            placeholder="e.g. arya@gmail.com"
            className="inp" />
        </div>

        {error && <div className="err">⚠️ {error}</div>}

        <button onClick={handleStart} disabled={loading} className="btn btn-primary btn-full">
          {loading ? "Setting up..." : "Get Started →"}
        </button>

        <p style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
          💡 Invoice will be sent to this email after payment.<br />
          Returning user? Enter same email to continue.
        </p>
      </div>
    </div>
  );
}
