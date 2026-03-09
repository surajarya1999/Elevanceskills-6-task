"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/hooks/redux";

interface Comment { userId: string; userName: string; userAvatar: string; text: string; createdAt: string; }
interface Post {
  _id: string; userId: string; userName: string; userAvatar: string;
  caption: string; mediaUrl: string; mediaType: "image" | "video";
  likes: string[]; comments: Comment[]; shares: number; createdAt: string;
}

export default function PostCard({ post: initialPost }: { post: Post }) {
  const currentUser = useAppSelector(s => s.user.currentUser);
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLiked = currentUser ? post.likes.includes(currentUser._id) : false;

  const handleLike = async () => {
    if (!currentUser) return alert("Please select a user first");
    const res = await fetch("/api/posts/like", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post._id, userId: currentUser._id }),
    });
    const data = await res.json();
    if (data.success) {
      setPost(p => ({
        ...p,
        likes: data.liked
          ? [...p.likes, currentUser._id]
          : p.likes.filter(id => id !== currentUser._id),
      }));
    }
  };

  const handleComment = async () => {
    if (!currentUser) return alert("Please select a user first");
    if (!commentText.trim()) return;
    setCommenting(true);
    const res = await fetch("/api/posts/comment", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post._id, userId: currentUser._id, text: commentText }),
    });
    const data = await res.json();
    if (data.success) {
      setPost(p => ({ ...p, comments: [...p.comments, data.comment] }));
      setCommentText("");
    }
    setCommenting(false);
  };

  const handleShare = async () => {
    setSharing(true);
    await fetch("/api/posts/share", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post._id }),
    });
    setPost(p => ({ ...p, shares: p.shares + 1 }));
    // Copy link to clipboard
    await navigator.clipboard.writeText(`${window.location.origin}/en/feed?post=${post._id}`);
    setCopied(true);
    setTimeout(() => { setCopied(false); setSharing(false); }, 2000);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <img src={post.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userName}`}
          alt={post.userName} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
        <div>
          <p className="font-semibold text-gray-900 text-sm">{post.userName}</p>
          <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Caption */}
      {post.caption && <p className="px-4 pb-2 text-sm text-gray-700">{post.caption}</p>}

      {/* Media */}
      <div className="w-full bg-gray-100 relative">
        {post.mediaType === "video" ? (
          <video src={post.mediaUrl} controls className="w-full max-h-96 object-contain" />
        ) : (
          <img src={post.mediaUrl} alt="post" className="w-full max-h-96 object-contain" />
        )}
      </div>

      {/* Stats */}
      <div className="px-4 py-2 flex items-center gap-4 text-xs text-gray-400 border-b border-gray-50">
        <span>❤️ {post.likes.length} likes</span>
        <span>💬 {post.comments.length} comments</span>
        <span>🔗 {post.shares} shares</span>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex gap-1">
        <button onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all
            ${isLiked ? "bg-red-50 text-red-500" : "text-gray-500 hover:bg-gray-50"}`}>
          {isLiked ? "❤️" : "🤍"} Like
        </button>
        <button onClick={() => setShowComments(v => !v)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all">
          💬 Comment
        </button>
        <button onClick={handleShare} disabled={sharing}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all">
          {copied ? "✅ Copied!" : "🔗 Share"}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-50 pt-3">
          {post.comments.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be the first!</p>
          )}
          {post.comments.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <img src={c.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.userName}`}
                alt={c.userName} className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                <p className="text-xs font-semibold text-gray-800">{c.userName}</p>
                <p className="text-xs text-gray-600 mt-0.5">{c.text}</p>
              </div>
            </div>
          ))}

          {/* Comment input */}
          {currentUser && (
            <div className="flex gap-2 mt-2">
              <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                alt={currentUser.name} className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="flex-1 flex gap-2">
                <input value={commentText} onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleComment()}
                  placeholder="Write a comment..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-400" />
                <button onClick={handleComment} disabled={commenting || !commentText.trim()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl">
                  {commenting ? "..." : "Post"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
