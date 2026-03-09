"use client";
import { useState, useEffect } from "react";
import API_URL from "@/config/api";

interface LoginRecord {
  _id: string; browser: string; os: string;
  deviceType: "desktop" | "laptop" | "mobile";
  ipAddress: string;
  status: "success" | "blocked" | "otp_pending" | "otp_verified";
  blockReason?: string; loginAt: string;
}

const statusConfig = {
  success:      { label: "✅ Success",      color: "bg-green-100 text-green-700" },
  blocked:      { label: "🚫 Blocked",      color: "bg-red-100 text-red-700" },
  otp_pending:  { label: "⏳ OTP Pending",  color: "bg-yellow-100 text-yellow-700" },
  otp_verified: { label: "🔐 OTP Verified", color: "bg-blue-100 text-blue-700" },
};
const deviceIcon = { desktop: "🖥️", laptop: "💻", mobile: "📱" };

export default function LoginHistory({ userId }: { userId: string }) {
  const [history, setHistory] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/history?userId=${userId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setHistory(d.history); })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="text-sm text-gray-400 py-4 text-center">Loading login history...</div>;
  if (history.length === 0) return (
    <div className="text-sm text-gray-400 py-6 text-center"><div className="text-3xl mb-2">📋</div>No login history yet</div>
  );

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-900 text-sm">🕒 Login History</h3>
      {history.map(record => (
        <div key={record._id} className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5 border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">{deviceIcon[record.deviceType]} {record.browser} on {record.os}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[record.status].color}`}>
              {statusConfig[record.status].label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>📍 {record.ipAddress}</span>
            <span>📅 {new Date(record.loginAt).toLocaleString()}</span>
          </div>
          {record.blockReason && <div className="text-red-500 font-medium">⚠️ {record.blockReason}</div>}
        </div>
      ))}
    </div>
  );
}
