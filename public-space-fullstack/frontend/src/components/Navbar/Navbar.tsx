"use client";

import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const currentUser = useAppSelector(s => s.user.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <nav className="ps-navbar">
      <div className="ps-navbar-inner">
        <Link href="/feed" className="ps-logo">
          <div className="ps-logo-icon">🌐</div>
          <span>Public<span className="ps-logo-accent">Space</span></span>
        </Link>

        <div className="ps-nav-links">
          <Link href="/feed" className="ps-nav-link">🏠 Feed</Link>
          {currentUser && <Link href="/profile" className="ps-nav-link">👤 Profile</Link>}
        </div>

        <div className="ps-nav-right">
          {currentUser ? (
            <>
              <div className="ps-user-info">
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                  alt={currentUser.name}
                  className="ps-avatar-sm"
                />
                <span className="ps-username">{currentUser.name}</span>
              </div>
              <button onClick={handleLogout} className="ps-btn-danger">Logout</button>
            </>
          ) : (
            <Link href="/login" className="ps-btn-primary">Login →</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
