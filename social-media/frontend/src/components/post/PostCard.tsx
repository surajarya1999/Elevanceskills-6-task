"use client";
import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import API_URL from "@/config/api";

interface Comment { userId: string; userName: string; userAvatar: string; text: string; createdAt: string; }
interface Post { _id: string; userId: string; userName: string; userAvatar: string; caption: string; mediaUrl: string; mediaType: "image" | "video"; likes: string[]; comments: Comment[]; shares: number; createdAt: string; }

export default function PostCard({ post: initialPost }: { post: Post }) {
  const currentUser = useAppSelector(s => s.user.currentUser);
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLiked = currentUser ? post.likes.includes(currentUser._id) : false;

  const handleLike = async () => {
    if (!currentUser) return;
    const res = await fetch(`${API_URL}/api/posts/${post._id}/like`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser._id }),
    });
    const data = await res.json();
    if (data.success) setPost(p => ({ ...p, likes: data.liked ? [...p.likes, currentUser._id] : p.likes.filter(id => id !== currentUser._id) }));
  };

  const handleComment = async () => {
    if (!currentUser || !commentText.trim()) return;
    setCommenting(true);
    const res = await fetch(`${API_URL}/api/posts/${post._id}/comment`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser._id, userName: currentUser.name, userAvatar: currentUser.avatar, text: commentText }),
    });
    const data = await res.json();
    if (data.success) { setPost(p => ({ ...p, comments: [...p.comments, data.comment] })); setCommentText(""); }
    setCommenting(false);
  };

  const handleShare = async () => {
    await fetch(`${API_URL}/api/posts/${post._id}/share`, { method: "POST" });
    setPost(p => ({ ...p, shares: p.shares + 1 }));
    await navigator.clipboard.writeText(`${window.location.origin}/feed?post=${post._id}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now"; if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`; return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="ps-post-card">
      <div className="ps-post-header">
        <img src={post.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userName}`}
          alt={post.userName} className="ps-avatar-md" />
        <div>
          <p className="ps-post-author">{post.userName}</p>
          <p className="ps-post-time">{timeAgo(post.createdAt)}</p>
        </div>
      </div>
      {post.caption && <p className="ps-post-caption">{post.caption}</p>}
      <div className="ps-post-media">
        {post.mediaType === "video"
          ? <video src={post.mediaUrl} controls className="ps-media" />
          : <img src={post.mediaUrl} alt="post" className="ps-media" />}
      </div>
      <div className="ps-post-stats">
        <span>❤️ {post.likes.length}</span>
        <span>💬 {post.comments.length}</span>
        <span>🔗 {post.shares}</span>
      </div>
      <div className="ps-post-actions">
        <button onClick={handleLike} className={`ps-action-post-btn ${isLiked ? "ps-action-post-btn--liked" : ""}`}>
          {isLiked ? "❤️" : "🤍"} Like
        </button>
        <button onClick={() => setShowComments(v => !v)} className="ps-action-post-btn">
          💬 Comment
        </button>
        <button onClick={handleShare} className="ps-action-post-btn">
          {copied ? "✅ Copied!" : "🔗 Share"}
        </button>
      </div>
      {showComments && (
        <div className="ps-comments">
          {post.comments.length === 0 && <p className="ps-muted" style={{textAlign:"center",padding:"8px 0"}}>No comments yet.</p>}
          {post.comments.map((c, i) => (
            <div key={i} className="ps-comment">
              <img src={c.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.userName}`}
                alt={c.userName} className="ps-avatar-xs" />
              <div className="ps-comment-bubble">
                <p className="ps-comment-author">{c.userName}</p>
                <p className="ps-comment-text">{c.text}</p>
              </div>
            </div>
          ))}
          {currentUser && (
            <div className="ps-comment-input-row">
              <img src={currentUser.avatar} alt={currentUser.name} className="ps-avatar-xs" />
              <input value={commentText} onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleComment()}
                placeholder="Write a comment..."
                className="ps-input ps-comment-input" />
              <button onClick={handleComment} disabled={commenting || !commentText.trim()} className="ps-btn-primary ps-btn-xs">
                {commenting ? "..." : "Post"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
