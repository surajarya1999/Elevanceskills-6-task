import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ success: false, message: "postId required" }, { status: 400 });

    const post = await Post.findByIdAndUpdate(postId, { $inc: { shares: 1 } }, { new: true });
    if (!post) return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });

    return NextResponse.json({ success: true, shares: post.shares });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
