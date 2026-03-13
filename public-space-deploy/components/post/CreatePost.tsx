"use client";

import { useState, useRef } from "react";
import { useAppSelector } from "@/hooks/redux";

interface Props { onPostCreated: () => void; }

export default function CreatePost({ onPostCreated }: Props) {
  const currentUser = useAppSelector(s => s.user.currentUser);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const handleSubmit = async () => {
    if (!currentUser) { setError("Please select a user first"); return; }
    if (!file) { setError("Please select a photo or video"); return; }

    setLoading(true); setError("");

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) { setError("Upload failed: " + uploadData.message); setLoading(false); return; }

      // 2. Create post
      const postRes = await fetch("/api/posts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          caption,
          mediaUrl: uploadData.url,
          mediaType: uploadData.mediaType,
          publicId: uploadData.publicId,
        }),
      });
      const postData = await postRes.json();

      if (postData.limitReached) {
        setError(postData.message);
        setLoading(false);
        return;
      }

      if (postData.success) {
        setCaption(""); setFile(null); setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
        onPostCreated();
      } else {
        setError(postData.message);
      }
    } catch { setError("Something went wrong. Try again."); }
    setLoading(false);
  };

  const friendCount = currentUser?.friends.length ?? 0;
  const postLimitInfo = friendCount === 0
    ? "❌ Add at least 1 friend to post"
    : friendCount > 10
    ? "✅ Unlimited posts per day"
    : `📊 ${friendCount} post${friendCount > 1 ? "s" : ""} per day (you have ${friendCount} friend${friendCount > 1 ? "s" : ""})`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-center gap-3 mb-4">
        {currentUser && (
          <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
            alt={currentUser.name} className="w-10 h-10 rounded-full bg-gray-100" />
        )}
        <div className="flex-1">
          <textarea value={caption} onChange={e => setCaption(e.target.value)}
            placeholder={currentUser ? "What's on your mind?" : "Select a user to post..."}
            disabled={!currentUser}
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none disabled:opacity-50" />
        </div>
      </div>

      {/* Media preview */}
      {preview && (
        <div className="relative mb-3 rounded-xl overflow-hidden bg-gray-100">
          {file?.type.startsWith("video/")
            ? <video src={preview} controls className="w-full max-h-48 object-contain" />
            : <img src={preview} alt="preview" className="w-full max-h-48 object-contain" />
          }
          <button onClick={() => { setPreview(null); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
            className="absolute top-2 right-2 bg-black/50 text-white w-7 h-7 rounded-full text-sm hover:bg-black/70">✕</button>
        </div>
      )}

      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
          <span>⚠️</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Post limit info */}
      {currentUser && (
        <p className="text-xs text-gray-400 mb-3">{postLimitInfo}</p>
      )}

      <div className="flex items-center gap-2">
        <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors
          ${currentUser ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-gray-50 text-gray-300 cursor-not-allowed"}`}>
          📷 Photo/Video
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
            onChange={handleFile} disabled={!currentUser} />
        </label>

        <button onClick={handleSubmit} disabled={loading || !file || !currentUser || friendCount === 0}
          className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Posting...
            </span>
          ) : "Post"}
        </button>
      </div>
    </div>
  );
}
