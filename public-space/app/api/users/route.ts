import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("name email avatar friends").limit(50);
    return NextResponse.json({ success: true, users });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, avatar } = await req.json();
    if (!name || !email) return NextResponse.json({ success: false, message: "name and email required" }, { status: 400 });

    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ success: true, user: existing }); // return existing user

    const user = await User.create({ name, email, avatar: avatar ?? "", friends: [] });
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 });
  }
}
