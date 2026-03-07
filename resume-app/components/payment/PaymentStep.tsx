"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setPaymentDone, setStep } from "@/store/slices/resumeSlice";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string; amount: number; currency: string; name: string;
  description: string; order_id: string; prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance { open(): void; }
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function PaymentStep() {
  const t = useTranslations("resume.payment");
  const dispatch = useAppDispatch();
  const formData = useAppSelector(s => s.resume.formData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRazorpay = () =>
    new Promise<boolean>(resolve => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async () => {
    setLoading(true); setError("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { setError("Failed to load payment gateway. Check internet."); setLoading(false); return; }

      const orderRes = await fetch("/api/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData?.email, name: formData?.name }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) { setError(orderData.message); setLoading(false); return; }

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Student Internship Portal",
        description: "Professional Resume Generation",
        order_id: orderData.orderId,
        prefill: { name: formData?.name ?? "", email: formData?.email ?? "", contact: formData?.phone ?? "" },
        theme: { color: "#2563eb" },
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            dispatch(setPaymentDone({ paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id }));
          } else {
            setError("Payment verification failed. Contact support.");
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💳</div>
          <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
          <p className="text-gray-500 text-sm mt-2">{t("desc")}</p>
        </div>

        {/* Price Card */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-center border border-blue-100">
          <p className="text-5xl font-extrabold text-blue-600 mb-2">{t("amount")}</p>
          <p className="text-gray-600 font-medium">{t("feature")}</p>
          <div className="mt-4 space-y-1 text-sm text-gray-500">
            <p>✅ Professional PDF Resume</p>
            <p>✅ Attached to your profile</p>
            <p>✅ Ready for internship applications</p>
          </div>
        </div>

        {error && <p className="text-center text-sm text-red-500 mb-4 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

        <button onClick={handlePay} disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-lg rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
          {loading ? (
            <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> {t("processing")}</>
          ) : t("pay")}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
          🔒 {t("secure")}
        </p>

        <button onClick={() => dispatch(setStep("form"))}
          className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 text-sm">← Back to form</button>
      </div>
    </div>
  );
}
