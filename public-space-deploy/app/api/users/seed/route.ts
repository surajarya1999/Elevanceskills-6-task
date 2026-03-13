import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const MOCK_USERS = [
  { name: "Arya Singh",     email: "arya@demo.com",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arya" },
  { name: "Sofia Martín",   email: "sofia@demo.com",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia" },
  { name: "Lucas Ferreira", email: "lucas@demo.com",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas" },
  { name: "Priya Sharma",   email: "priya@demo.com",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" },
  { name: "Chen Wei",       email: "chen@demo.com",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen" },
];

export async function POST() {
  try {
    await connectDB();

    const users = [];
    for (const u of MOCK_USERS) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        const user = await User.create({ ...u, friends: [] });
        users.push(user);
      } else {
        users.push(existing);
      }
    }

    return NextResponse.json({ success: true, users, message: "Seed data created!" });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Seed failed: " + err }, { status: 500 });
  }
}
