const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userAvatar: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    caption: { type: String, default: "" },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    publicId: { type: String, default: "" },
    likes: [{ type: String }],
    comments: [CommentSchema],
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Post || mongoose.model("Post", PostSchema);
