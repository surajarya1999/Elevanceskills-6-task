import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { userId } = await req.json();
    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });

    const uid = new mongoose.Types.ObjectId(userId);
    const alreadyLiked = post.likes.some((id) => id.equals(uid));

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => !id.equals(uid)); // unlike
    } else {
      post.likes.push(uid); // like
    }

    await post.save();
    return NextResponse.json({ success: true, likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
