import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, friendId } = await req.json();
    if (!userId || !friendId) return NextResponse.json({ success: false, message: "userId and friendId required" }, { status: 400 });
    if (userId === friendId) return NextResponse.json({ success: false, message: "Cannot add yourself" }, { status: 400 });

    const [user, friend] = await Promise.all([User.findById(userId), User.findById(friendId)]);
    if (!user || !friend) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }
    if (!friend.friends.includes(userId)) {
      friend.friends.push(userId);
      await friend.save();
    }

    return NextResponse.json({ success: true, friendCount: user.friends.length });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
