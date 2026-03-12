"use client";
import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginHistory from "@/components/auth/LoginHistory";

export default function ProfilePage() {
  const currentUser = useAppSelector(s => s.user.currentUser);
  const router = useRouter();

  useEffect(() => { if (!currentUser) router.push("/login"); }, [currentUser, router]);
  if (!currentUser) return null;

  const friendCount = currentUser.friends.length;
  const postLimit = friendCount === 0 ? "Cannot post" : friendCount > 10 ? "Unlimited" : `${friendCount}/day`;

  return (
    <div className="ps-page">
      <div className="ps-profile-card">
        <div className="ps-profile-header">
          <img
            src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
            alt={currentUser.name}
            className="ps-avatar-lg"
          />
          <div>
            <h1 className="ps-profile-name">{currentUser.name}</h1>
            <p className="ps-profile-email">{currentUser.email}</p>
            <div className="ps-profile-stats">
              <span className="ps-stat">👥 {friendCount} friends</span>
              <span className="ps-stat">📊 {postLimit}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="ps-profile-card">
        <LoginHistory userId={currentUser._id} />
      </div>
    </div>
  );
}
