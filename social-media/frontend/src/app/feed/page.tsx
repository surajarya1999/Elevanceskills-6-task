"use client";
import { useState, useEffect, useCallback } from "react";
import CreatePost from "@/components/post/CreatePost";
import PostCard from "@/components/post/PostCard";
import Sidebar from "@/components/ui/Sidebar";
import API_URL from "@/config/api";

interface Post { _id: string; userId: string; userName: string; userAvatar: string; caption: string; mediaUrl: string; mediaType: "image" | "video"; likes: string[]; comments: { userId: string; userName: string; userAvatar: string; text: string; createdAt: string }[]; shares: number; createdAt: string; }

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts`);
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return (
    <div className="ps-page">
      <div className="ps-feed-header">
        <h1 className="ps-page-title">🌐 Public Space</h1>
        <p className="ps-page-sub">Share photos & videos with the community</p>
      </div>
      <div className="ps-feed-grid">
        <div className="ps-feed-main">
          <CreatePost onPostCreated={fetchPosts} />
          {loading ? (
            <div className="ps-empty"><div className="ps-empty-icon">📸</div><p>Loading posts...</p></div>
          ) : posts.length === 0 ? (
            <div className="ps-empty-card"><div className="ps-empty-icon">📭</div><h3>No posts yet</h3><p>Select a user, add friends, then post!</p></div>
          ) : posts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
        <div className="ps-feed-sidebar">
          <div className="ps-sidebar-sticky">
            <Sidebar />
            <div className="ps-rules-card">
              <h3 className="ps-rules-title">📋 Posting Rules</h3>
              <div className="ps-rules-list">
                <div className="ps-rule-item"><span className="ps-rule-badge ps-rule-red">0</span><span>No friends → <strong>Cannot post</strong></span></div>
                <div className="ps-rule-item"><span className="ps-rule-badge ps-rule-yellow">1</span><span>1 friend → <strong>1 post/day</strong></span></div>
                <div className="ps-rule-item"><span className="ps-rule-badge ps-rule-blue">2</span><span>2 friends → <strong>2 posts/day</strong></span></div>
                <div className="ps-rule-item"><span className="ps-rule-badge ps-rule-green">10+</span><span>10+ friends → <strong>Unlimited!</strong></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
