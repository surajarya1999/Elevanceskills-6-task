import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { postId, userId } = await req.json();
    if (!postId || !userId) return NextResponse.json({ success: false, message: "postId and userId required" }, { status: 400 });

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id: string) => id !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    return NextResponse.json({ success: true, liked: !alreadyLiked, likesCount: post.likes.length });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
