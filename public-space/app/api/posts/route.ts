import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { canPost } from "@/lib/postLimit";

// GET all posts (feed)
export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, posts });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST create new post
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, caption, mediaUrl, mediaType, publicId } = await req.json();

    if (!userId || !mediaUrl) {
      return NextResponse.json({ success: false, message: "userId and mediaUrl required" }, { status: 400 });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const friendCount = user.friends.length;

    // Count posts today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const postsToday = await Post.countDocuments({
      userId,
      createdAt: { $gte: todayStart },
    });

    // Check posting limit
    const { allowed, reason } = canPost(friendCount, postsToday);
    if (!allowed) {
      return NextResponse.json({ success: false, message: reason, limitReached: true }, { status: 403 });
    }

    const post = await Post.create({
      userId,
      userName: user.name,
      userAvatar: user.avatar,
      caption,
      mediaUrl,
      mediaType: mediaType ?? "image",
      publicId: publicId ?? "",
      likes: [],
      comments: [],
      shares: 0,
    });

    return NextResponse.json({ success: true, post });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to create post" }, { status: 500 });
  }
}
