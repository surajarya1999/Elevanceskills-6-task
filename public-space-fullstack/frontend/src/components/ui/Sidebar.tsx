"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setCurrentUser, addFriend, removeFriend } from "@/store/slices/userSlice";
import API_URL from "@/config/api";

interface User { _id: string; name: string; email: string; avatar: string; friends: string[]; }

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(s => s.user.currentUser);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    await fetch(`${API_URL}/api/users/seed`, { method: "POST" });
    await fetchUsers();
    setSeeding(false);
  };

  const handleFriend = async (friendId: string) => {
    if (!currentUser) return;
    const isFriend = currentUser.friends.includes(friendId);
    const res = await fetch(`${API_URL}/api/friends/${isFriend ? "remove" : "add"}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser._id, friendId }),
    });
    const data = await res.json();
    if (data.success) {
      if (isFriend) dispatch(removeFriend(friendId));
      else dispatch(addFriend(friendId));
      await fetchUsers();
    }
  };

  const friendCount = currentUser?.friends.length ?? 0;
  const postLimit = friendCount === 0 ? "Cannot post" : friendCount > 10 ? "Unlimited" : `${friendCount}/day`;

  return (
    <div className="ps-sidebar-wrap">
      <div className="ps-card">
        <h3 className="ps-card-title">👤 Logged in as</h3>
        {currentUser ? (
          <div className="ps-user-row">
            <img src={currentUser.avatar} alt={currentUser.name} className="ps-avatar-md" />
            <div>
              <p className="ps-user-name">{currentUser.name}</p>
              <p className="ps-user-sub">{friendCount} friends · {postLimit}</p>
            </div>
          </div>
        ) : <p className="ps-muted">Select a user below ↓</p>}
      </div>

      <div className="ps-card">
        <div className="ps-card-header">
          <h3 className="ps-card-title">👥 Users</h3>
          {users.length === 0 && (
            <button onClick={handleSeed} disabled={seeding} className="ps-btn-primary ps-btn-xs">
              {seeding ? "..." : "Load Demo"}
            </button>
          )}
        </div>
        {loading ? <p className="ps-muted">Loading...</p> :
          users.length === 0 ? <p className="ps-muted">No users. Click "Load Demo"</p> :
          <div className="ps-user-list">
            {users.map(user => {
              const isMe = currentUser?._id === user._id;
              const isFriend = currentUser?.friends.includes(user._id);
              return (
                <div key={user._id} className={`ps-user-item ${isMe ? "ps-user-item--me" : ""}`}>
                  <img src={user.avatar} alt={user.name} className="ps-avatar-xs" />
                  <div className="ps-user-item-info">
                    <p className="ps-user-item-name">{user.name}</p>
                    <p className="ps-user-item-sub">{user.friends.length} friends</p>
                  </div>
                  {!isMe ? (
                    <div className="ps-user-actions">
                      <button onClick={() => dispatch(setCurrentUser(user))} className="ps-action-btn">Use</button>
                      {currentUser && (
                        <button onClick={() => handleFriend(user._id)} className={`ps-action-btn ${isFriend ? "ps-action-btn--remove" : "ps-action-btn--add"}`}>
                          {isFriend ? "−" : "+"}
                        </button>
                      )}
                    </div>
                  ) : <span className="ps-you-badge">You</span>}
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
}
