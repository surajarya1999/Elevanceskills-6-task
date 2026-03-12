"use client";
import { useState, useRef } from "react";
import { useAppSelector } from "@/hooks/redux";
import API_URL from "@/config/api";

export default function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
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
    setFile(f); setPreview(URL.createObjectURL(f)); setError("");
  };

  const handleSubmit = async () => {
    if (!currentUser) { setError("Please select a user first"); return; }
    if (!file) { setError("Please select a photo or video"); return; }
    setLoading(true); setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch(`${API_URL}/api/upload`, { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) { setError("Upload failed: " + uploadData.message); setLoading(false); return; }

      const postRes = await fetch(`${API_URL}/api/posts`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, caption, mediaUrl: uploadData.url, mediaType: uploadData.mediaType, publicId: uploadData.publicId }),
      });
      const postData = await postRes.json();
      if (postData.limitReached) { setError(postData.message); setLoading(false); return; }
      if (postData.success) {
        setCaption(""); setFile(null); setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
        onPostCreated();
      } else { setError(postData.message); }
    } catch { setError("Something went wrong. Try again."); }
    setLoading(false);
  };

  const friendCount = currentUser?.friends.length ?? 0;
  const postLimitInfo = friendCount === 0 ? "❌ Add at least 1 friend to post"
    : friendCount > 10 ? "✅ Unlimited posts per day"
    : `📊 ${friendCount} post${friendCount > 1 ? "s" : ""} per day`;

  return (
    <div className="ps-create-card">
      <div className="ps-create-row">
        {currentUser && (
          <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
            alt={currentUser.name} className="ps-avatar-md" />
        )}
        <textarea value={caption} onChange={e => setCaption(e.target.value)}
          placeholder={currentUser ? "What's on your mind?" : "Select a user to post..."}
          disabled={!currentUser} rows={2}
          className="ps-input ps-create-textarea" />
      </div>
      {preview && (
        <div className="ps-preview">
          {file?.type.startsWith("video/")
            ? <video src={preview} controls className="ps-preview-media" />
            : <img src={preview} alt="preview" className="ps-preview-media" />}
          <button onClick={() => { setPreview(null); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
            className="ps-preview-close">✕</button>
        </div>
      )}
      {error && (
        <div className="ps-error">⚠️ {error}</div>
      )}
      {currentUser && <p className="ps-muted" style={{marginBottom: 10}}>{postLimitInfo}</p>}
      <div className="ps-create-footer">
        <label className={`ps-file-btn ${!currentUser ? "ps-file-btn--disabled" : ""}`}>
          📷 Photo/Video
          <input ref={fileRef} type="file" accept="image/*,video/*" style={{display:"none"}} onChange={handleFile} disabled={!currentUser} />
        </label>
        <button onClick={handleSubmit} disabled={loading || !file || !currentUser || friendCount === 0}
          className="ps-btn-primary">
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
