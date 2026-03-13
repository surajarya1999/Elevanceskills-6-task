import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const post = await Post.findByIdAndUpdate(
      params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );
    if (!post) return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    return NextResponse.json({ success: true, shares: post.shares });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
