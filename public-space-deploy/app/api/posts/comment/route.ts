import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { postId, userId, text } = await req.json();
    if (!postId || !userId || !text?.trim()) {
      return NextResponse.json({ success: false, message: "postId, userId and text required" }, { status: 400 });
    }

    const [post, user] = await Promise.all([Post.findById(postId), User.findById(userId)]);
    if (!post) return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const comment = { userId, userName: user.name, userAvatar: user.avatar, text: text.trim(), createdAt: new Date() };
    post.comments.push(comment);
    await post.save();

    return NextResponse.json({ success: true, comment });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
