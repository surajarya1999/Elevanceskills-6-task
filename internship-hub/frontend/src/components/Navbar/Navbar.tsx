"use client";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store/slices/userSlice";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const currentUser = useAppSelector(s => s.user.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const path = usePathname();

  return (
    <nav className="nav">
      <div className="nav-in">
        <Link href={currentUser ? "/dashboard" : "/"} className="nav-logo">
          <div className="nav-logo-icon">💼</div>
          <span>Internship<span className="accent">Hub</span></span>
        </Link>

        {currentUser && (
          <div className="nav-links">
            <Link href="/dashboard" className={`nav-link ${path === "/dashboard" ? "on" : ""}`}>🏠 Dashboard</Link>
            <Link href="/plans" className={`nav-link ${path === "/plans" ? "on" : ""}`}>⭐ Plans</Link>
          </div>
        )}

        <div className="nav-r">
          {currentUser ? (
            <>
              <span className={`badge badge-${currentUser.plan}`}>{currentUser.plan}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{currentUser.name}</span>
              <button onClick={() => { dispatch(logout()); router.push("/"); }} className="btn btn-danger btn-sm">Logout</button>
            </>
          ) : (
            <Link href="/" className="btn btn-primary btn-sm">Get Started →</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
