"use client";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API_URL from "@/config/api";

declare global { interface Window { Razorpay: any } }

const PLANS = [
  { id: "free",   name: "Free Plan",   icon: "🆓", price: 0,    limit: 1,        priceClass: "price-free",   btnClass: "btn-ghost",  features: ["1 application/month", "Browse all internships"] },
  { id: "bronze", name: "Bronze Plan", icon: "🥉", price: 100,  limit: 3,        priceClass: "price-bronze", btnClass: "btn-bronze", features: ["3 applications/month", "Application tracking"] },
  { id: "silver", name: "Silver Plan", icon: "🥈", price: 300,  limit: 5,        priceClass: "price-silver", btnClass: "btn-silver", features: ["5 applications/month", "Priority listing", "Early access"], popular: true },
  { id: "gold",   name: "Gold Plan",   icon: "🥇", price: 1000, limit: "Unlimited", priceClass: "price-gold", btnClass: "btn-gold",   features: ["Unlimited applications", "Top priority", "Dedicated support", "Resume review"], gold: true },
];

export default function PlansPage() {
  const currentUser = useAppSelector(s => s.user.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [istTime, setIstTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser) { router.push("/"); return; }

    // Load Razorpay script
    if (!document.querySelector('script[src*="razorpay"]')) {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(s);
    }

    // Payment window check
    const check = () => {
      const ist = new Date(new Date().getTime() + 5.5 * 3600000);
      const h = ist.getUTCHours(), m = ist.getUTCMinutes();
      setIstTime(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} IST`);
      setIsOpen(h * 60 + m >= 600 && h * 60 + m < 660);
    };
    check();
    const t = setInterval(check, 15000);

    // Load payment history
    fetch(`${API_URL}/api/payments/history/${currentUser._id}`)
      .then(r => r.json()).then(d => { if (d.success) setHistory(d.payments); });

    return () => clearInterval(t);
  }, [currentUser]);

  const handleSubscribe = async (planId: string) => {
    if (!currentUser || planId === "free") return;
    setLoadingPlan(planId); setErr(""); setMsg("");
    try {
      const res = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, plan: planId }),
      });
      const data = await res.json();
      if (!data.success) { setErr(data.message); setLoadingPlan(null); return; }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "InternshipHub",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        order_id: data.orderId,
        prefill: { name: data.userName, email: data.userEmail },
        theme: { color: "#6366f1" },
        handler: async (response: any) => {
          const vRes = await fetch(`${API_URL}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentDbId: data.paymentDbId,
            }),
          });
          const vData = await vRes.json();
          if (vData.success) {
            dispatch(updateUser(vData.user));
            setMsg(`${vData.message}`);
            // Refresh history
            fetch(`${API_URL}/api/payments/history/${currentUser._id}`)
              .then(r => r.json()).then(d => { if (d.success) setHistory(d.payments); });
          } else {
            setErr("Payment verification failed. Contact support.");
          }
          setLoadingPlan(null);
        },
        modal: { ondismiss: () => setLoadingPlan(null) },
      });
      rzp.open();
    } catch {
      setErr("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="pg">
      <div className="plans-hero">
        <h1 className="plans-title">💼 Subscription Plans</h1>
        <p className="plans-sub">Upgrade to apply for more internships every month</p>
      </div>

      {/* Time window */}
      <div className="time-box">
        <p className="time-box-title">⏰ Payment Window: 10:00 AM – 11:00 AM IST Only</p>
        <p className="time-box-sub">
          Current time: <strong>{istTime}</strong> &nbsp;·&nbsp;
          Payments: {isOpen
            ? <span style={{ color: "var(--green)", fontWeight: 700 }}>✅ Open Now!</span>
            : <span style={{ color: "var(--red)", fontWeight: 700 }}>❌ Closed</span>}
        </p>
      </div>

      {msg && <div className="suc">🎉 {msg}</div>}
      {err && <div className="err">⚠️ {err}</div>}

      {/* Plans grid */}
      <div className="plans-grid">
        {PLANS.map(p => (
          <div key={p.id} className={`plan-card ${p.popular ? "plan-card-popular" : ""} ${p.gold ? "plan-card-gold" : ""}`}>
            {p.popular && <span className="popular-badge">Most Popular</span>}
            <div className="plan-icon">{p.icon}</div>
            <div>
              <div className="plan-name">{p.name}</div>
              <div className={`plan-price ${p.priceClass}`}>
                {p.price === 0 ? "Free" : `₹${p.price}`}
                {p.price > 0 && <span>/month</span>}
              </div>
            </div>
            <div className="plan-limit">
              Apply for <strong>{p.limit} internship{p.limit !== 1 && p.limit !== "Unlimited" ? "s" : ""}</strong> per month
            </div>
            <div className="plan-features">
              {p.features.map((f, i) => <div key={i} className="plan-feature">✓ {f}</div>)}
            </div>
            {p.id === "free" ? (
              <div style={{ fontSize: 13, color: "var(--text3)", textAlign: "center", padding: "8px 0" }}>
                {currentUser.plan === "free" ? "✅ Your current plan" : "Default plan"}
              </div>
            ) : (
              <button onClick={() => handleSubscribe(p.id)}
                disabled={loadingPlan === p.id || currentUser.plan === p.id || !isOpen}
                className={`btn ${p.btnClass}`}>
                {loadingPlan === p.id ? "Processing..." :
                  currentUser.plan === p.id ? "✅ Active Plan" :
                  !isOpen ? "⏰ Opens 10 AM" :
                  `Subscribe — ₹${p.price}/mo`}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Current plan */}
      <div className="card" style={{ textAlign: "center", maxWidth: 420, margin: "0 auto 32px" }}>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6 }}>Your Current Plan</p>
        <p style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", textTransform: "capitalize" }}>{currentUser.plan} Plan</p>
        <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 6 }}>
          Used <strong>{currentUser.applicationsUsed}</strong> applications this month
        </p>
        <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ marginTop: 14, display: "inline-flex" }}>← Back to Dashboard</Link>
      </div>

      {/* Payment history */}
      {history.length > 0 && (
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 className="sec-title">📄 Payment History</h2>
          {history.map(h => (
            <div key={h._id} className="pay-item">
              <div>
                <div className="pay-plan">{h.plan} Plan</div>
                <div className="pay-inv">#{h.invoiceNumber} · Invoice sent to {h.userEmail}</div>
              </div>
              <div className="pay-amt">₹{h.amount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
