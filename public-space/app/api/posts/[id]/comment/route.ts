import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { userId, userName, userAvatar, text } = await req.json();

    if (!text?.trim()) return NextResponse.json({ success: false, message: "Comment cannot be empty" }, { status: 400 });

    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });

    post.comments.push({ user: userId, userName, userAvatar: userAvatar ?? "", text: text.trim(), createdAt: new Date() });
    await post.save();

    return NextResponse.json({ success: true, comments: post.comments });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
