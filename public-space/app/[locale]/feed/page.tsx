"use client";

import { useState, useEffect, useCallback } from "react";
import CreatePost from "@/components/post/CreatePost";
import PostCard from "@/components/post/PostCard";
import Sidebar from "@/components/ui/Sidebar";

interface Post {
  _id: string; userId: string; userName: string; userAvatar: string;
  caption: string; mediaUrl: string; mediaType: "image" | "video";
  likes: string[]; comments: { userId: string; userName: string; userAvatar: string; text: string; createdAt: string }[];
  shares: number; createdAt: string;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    if (data.success) setPosts(data.posts);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">🌐 Public Space</h1>
        <p className="text-gray-500 text-sm mt-1">Share photos & videos with the community</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          <CreatePost onPostCreated={fetchPosts} />

          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 animate-pulse">📸</div>
              <p className="text-gray-400">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="font-bold text-gray-900 mb-1">No posts yet</h3>
              <p className="text-gray-400 text-sm">Select a user, add friends, then post something!</p>
            </div>
          ) : (
            posts.map(post => <PostCard key={post._id} post={post} />)
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Sidebar />

            {/* Posting Rules */}
            <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3">📋 Posting Rules</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs">0</span>
                  <span>No friends → <strong className="text-red-500">Cannot post</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs">1</span>
                  <span>1 friend → <strong>1 post/day</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">2</span>
                  <span>2 friends → <strong>2 posts/day</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">10+</span>
                  <span>10+ friends → <strong className="text-green-500">Unlimited!</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
