import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST() {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});

    // Create 5 demo users
    const users = await User.insertMany([
      { name: "Arya Singh",     email: "arya@demo.com",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arya" },
      { name: "Priya Sharma",   email: "priya@demo.com",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
      { name: "Rahul Verma",    email: "rahul@demo.com",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
      { name: "Neha Gupta",     email: "neha@demo.com",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha" },
      { name: "Vikas Kumar",    email: "vikas@demo.com",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikas" },
    ]);

    // Arya has 0 friends (cannot post)
    // Priya has 1 friend → 1 post/day
    await User.findByIdAndUpdate(users[1]._id, { friends: [users[0]._id] });
    // Rahul has 2 friends → 2 posts/day
    await User.findByIdAndUpdate(users[2]._id, { friends: [users[0]._id, users[1]._id] });
    // Neha has 5 friends → 5 posts/day
    await User.findByIdAndUpdate(users[3]._id, { friends: [users[0]._id, users[1]._id, users[2]._id, users[4]._id, users[0]._id] });
    // Vikas has 11 friends → unlimited (we'll fake this)
    const fakeIds = Array.from({ length: 11 }, () => new (require("mongoose").Types.ObjectId)());
    await User.findByIdAndUpdate(users[4]._id, { friends: fakeIds });

    return NextResponse.json({ success: true, message: "Demo users seeded!", users: users.map(u => ({ id: u._id, name: u.name, email: u.email })) });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
