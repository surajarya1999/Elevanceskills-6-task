const Post = require("../models/Post.js");
const User = require("../models/User.js");
const { canPost } = require("../lib/postLimit.js");

async function getPosts(req, res) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, posts });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
}

async function createPost(req, res) {
  try {
    const { userId, caption, mediaUrl, mediaType, publicId } = req.body;
    if (!userId || !mediaUrl) return res.status(400).json({ success: false, message: "userId and mediaUrl required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const postsToday = await Post.countDocuments({ userId, createdAt: { $gte: todayStart } });

    const { allowed, reason } = canPost(user.friends.length, postsToday);
    if (!allowed) return res.status(403).json({ success: false, message: reason, limitReached: true });

    const post = await Post.create({
      userId, caption,
      userName: user.name,
      userAvatar: user.avatar,
      mediaUrl,
      mediaType: mediaType || "image",
      publicId: publicId || "",
      likes: [], comments: [], shares: 0,
    });

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
}

async function likePost(req, res) {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ success: true, likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ success: false, message: String(err) });
  }
}

async function commentPost(req, res) {
  try {
    const { userId, userName, userAvatar, text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: "Comment cannot be empty" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comment = { userId, userName, userAvatar: userAvatar || "", text: text.trim(), createdAt: new Date() };
    post.comments.push(comment);
    await post.save();

    res.json({ success: true, comment: post.comments[post.comments.length - 1] });
  } catch (err) {
    res.status(500).json({ success: false, message: String(err) });
  }
}

async function sharePost(req, res) {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { shares: 1 } }, { new: true });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, shares: post.shares });
  } catch (err) {
    res.status(500).json({ success: false, message: String(err) });
  }
}

module.exports = { getPosts, createPost, likePost, commentPost, sharePost };
