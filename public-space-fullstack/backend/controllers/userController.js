const User = require("../models/User.js");

const MOCK_USERS = [
  { name: "Arya Singh",     email: "arya@demo.com",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arya" },
  { name: "Sofia Martín",   email: "sofia@demo.com",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia" },
  { name: "Lucas Ferreira", email: "lucas@demo.com",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas" },
  { name: "Priya Sharma",   email: "priya@demo.com",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" },
  { name: "Chen Wei",       email: "chen@demo.com",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen" },
];

async function getUsers(req, res) {
  try {
    const users = await User.find().select("name email avatar friends").limit(50);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
}

async function seedUsers(req, res) {
  try {
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
    res.json({ success: true, users, message: "Demo users loaded!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Seed failed: " + err.message });
  }
}

module.exports = { getUsers, seedUsers };
