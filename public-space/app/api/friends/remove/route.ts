import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, friendId } = await req.json();
    if (!userId || !friendId) return NextResponse.json({ success: false, message: "userId and friendId required" }, { status: 400 });

    const [user, friend] = await Promise.all([User.findById(userId), User.findById(friendId)]);
    if (!user || !friend) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    user.friends = user.friends.filter((id: string) => id !== friendId);
    friend.friends = friend.friends.filter((id: string) => id !== userId);
    await Promise.all([user.save(), friend.save()]);

    return NextResponse.json({ success: true, friendCount: user.friends.length });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
