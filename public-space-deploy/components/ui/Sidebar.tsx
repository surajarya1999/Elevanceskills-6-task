"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setCurrentUser, addFriend, removeFriend } from "@/store/slices/userSlice";

interface User { _id: string; name: string; email: string; avatar: string; friends: string[]; }

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(s => s.user.currentUser);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data.success) setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    await fetch("/api/users/seed", { method: "POST" });
    await fetchUsers();
    setSeeding(false);
  };

  const handleSelectUser = (user: User) => {
    dispatch(setCurrentUser(user));
  };

  const handleFriend = async (friendId: string) => {
    if (!currentUser) return;
    const isFriend = currentUser.friends.includes(friendId);
    const endpoint = isFriend ? "/api/friends/remove" : "/api/friends/add";

    const res = await fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser._id, friendId }),
    });
    const data = await res.json();
    if (data.success) {
      if (isFriend) dispatch(removeFriend(friendId));
      else dispatch(addFriend(friendId));
      // Update users list
      await fetchUsers();
    }
  };

  const friendCount = currentUser?.friends.length ?? 0;
  const postLimit = friendCount === 0 ? "Cannot post" : friendCount > 10 ? "Unlimited" : `${friendCount}/day`;

  return (
    <div className="space-y-4">
      {/* Current User */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-3">👤 You are logged in as</h3>
        {currentUser ? (
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full bg-gray-100" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{currentUser.name}</p>
              <p className="text-xs text-gray-400">{friendCount} friends · {postLimit}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Select a user below ↓</p>
        )}
      </div>

      {/* Post Limit Info */}
      {currentUser && (
        <div className={`rounded-2xl p-4 text-sm border ${
          friendCount === 0 ? "bg-red-50 border-red-200" :
          friendCount > 10 ? "bg-green-50 border-green-200" :
          "bg-blue-50 border-blue-200"
        }`}>
          <p className="font-bold mb-1">
            {friendCount === 0 ? "❌ Cannot Post" : friendCount > 10 ? "✅ Unlimited Posts" : `📊 ${friendCount} Post${friendCount > 1 ? "s" : ""}/Day`}
          </p>
          <p className="text-xs text-gray-500">
            {friendCount === 0 ? "Add at least 1 friend to start posting" :
             friendCount > 10 ? "You have 10+ friends!" :
             `Add more friends to post more times per day`}
          </p>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-sm">👥 Users</h3>
          {users.length === 0 && (
            <button onClick={handleSeed} disabled={seeding}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {seeding ? "..." : "Load Demo Users"}
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-xs text-gray-400">No users yet. Click "Load Demo Users"</p>
        ) : (
          <div className="space-y-2">
            {users.map(user => {
              const isMe = currentUser?._id === user._id;
              const isFriend = currentUser?.friends.includes(user._id);
              return (
                <div key={user._id} className={`flex items-center gap-2 p-2 rounded-xl transition-all ${isMe ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}`}>
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.friends.length} friends</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {!isMe && (
                      <>
                        <button onClick={() => handleSelectUser(user)}
                          className={`text-xs px-2 py-1 rounded-lg font-medium ${isMe ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
                          {isMe ? "You" : "Use"}
                        </button>
                        {currentUser && (
                          <button onClick={() => handleFriend(user._id)}
                            className={`text-xs px-2 py-1 rounded-lg font-medium ${isFriend ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                            {isFriend ? "−" : "+"}
                          </button>
                        )}
                      </>
                    )}
                    {isMe && <span className="text-xs text-blue-600 font-bold px-2">You</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
