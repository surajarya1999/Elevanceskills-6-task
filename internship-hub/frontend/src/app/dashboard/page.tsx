"use client";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API_URL from "@/config/api";

const PLAN_LIMITS: Record<string, number> = { free: 1, bronze: 3, silver: 5, gold: 999999 };

interface Internship { _id: string; title: string; company: string; role: string; location: string; duration: string; stipend: string; description: string; tags: string[]; }
interface Application { _id: string; internshipTitle: string; company: string; role: string; status: string; createdAt: string; }

export default function DashboardPage() {
  const currentUser = useAppSelector(s => s.user.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!currentUser) { router.push("/"); return; }
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const [iRes, aRes] = await Promise.all([
        fetch(`${API_URL}/api/internships`),
        fetch(`${API_URL}/api/internships/applications/${currentUser!._id}`),
      ]);
      const iData = await iRes.json();
      const aData = await aRes.json();
      if (iData.success) setInternships(iData.internships);
      if (aData.success) setApplications(aData.applications);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleApply = async (internshipId: string) => {
    if (!currentUser) return;
    setApplying(internshipId); setMsg(""); setErr("");
    try {
      const res = await fetch(`${API_URL}/api/internships/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, internshipId }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`✅ ${data.message}`);
        dispatch(updateUser(data.user));
        setApplications(prev => [data.application, ...prev]);
      } else {
        setErr(data.message);
      }
    } catch { setErr("Something went wrong."); }
    setApplying(null);
  };

  if (!currentUser) return null;

  const limit = PLAN_LIMITS[currentUser.plan] || 1;
  const remaining = limit === 999999 ? "∞" : Math.max(0, limit - currentUser.applicationsUsed);
  const appliedSet = new Set(applications.map(a => a.internshipTitle + a.company));

  return (
    <div className="pg">
      {/* Header */}
      <div className="dash-header">
        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}&backgroundColor=6366f1`}
          alt={currentUser.name} className="dash-avatar" />
        <div>
          <div className="dash-name">Welcome, {currentUser.name}! 👋</div>
          <div className="dash-email">{currentUser.email}</div>
        </div>
      </div>

      {msg && <div className="suc">{msg}</div>}
      {err && (
        <div className="err">
          ⚠️ {err}
          {err.includes("upgrade") || err.includes("Upgrade") ? (
            <Link href="/plans" className="btn btn-primary btn-sm" style={{ marginLeft: 12 }}>Upgrade Plan →</Link>
          ) : null}
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-lbl">Current Plan</div>
          <div className={`stat-val`} style={{ textTransform: "capitalize", color: currentUser.plan === "gold" ? "var(--gold)" : currentUser.plan === "silver" ? "var(--silver-c)" : currentUser.plan === "bronze" ? "var(--bronze)" : "var(--green)" }}>
            {currentUser.plan}
          </div>
          <div className="stat-sub"><Link href="/plans" style={{ color: "#818cf8", textDecoration: "none" }}>Upgrade →</Link></div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Used This Month</div>
          <div className="stat-val">{currentUser.applicationsUsed}</div>
          <div className="stat-sub">applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Remaining</div>
          <div className="stat-val" style={{ color: "var(--green)" }}>{remaining}</div>
          <div className="stat-sub">of {limit === 999999 ? "unlimited" : limit}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Total Applied</div>
          <div className="stat-val">{applications.length}</div>
          <div className="stat-sub">all time</div>
        </div>
      </div>

      {/* Internships */}
      <div style={{ marginBottom: 40 }}>
        <h2 className="sec-title">🔍 Available Internships</h2>
        {loading ? (
          <div className="empty">Loading internships...</div>
        ) : (
          <div className="int-grid">
            {internships.map(i => {
              const applied = appliedSet.has(i.title + i.company);
              const canApply = !applied && Number(remaining) > 0;
              return (
                <div key={i._id} className="int-card">
                  <div>
                    <div className="int-company">{i.company}</div>
                    <div className="int-title">{i.title}</div>
                  </div>
                  <div className="int-meta">
                    <span className="meta-tag">📍 {i.location}</span>
                    <span className="meta-tag">⏱ {i.duration}</span>
                    <span className="meta-tag">💰 {i.stipend}</span>
                  </div>
                  {i.description && <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>{i.description}</p>}
                  <div className="tags">
                    {i.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <button onClick={() => handleApply(i._id)}
                    disabled={applying === i._id || applied || remaining === 0}
                    className={`btn btn-sm ${applied ? "btn-ghost" : "btn-primary"}`}>
                    {applying === i._id ? "Applying..." : applied ? "✅ Applied" : "Apply Now"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Applications */}
      <div>
        <h2 className="sec-title">📋 My Applications ({applications.length})</h2>
        {applications.length === 0 ? (
          <div className="empty">No applications yet. Apply to internships above!</div>
        ) : (
          <div className="app-list">
            {applications.map(a => (
              <div key={a._id} className="app-item">
                <div>
                  <div className="app-title">{a.internshipTitle}</div>
                  <div className="app-co">{a.company} · {a.role}</div>
                </div>
                <span className={`st st-${a.status}`}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
