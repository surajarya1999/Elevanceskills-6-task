const User = require("../models/User.js");

async function addFriend(req, res) {
  try {
    const { userId, friendId } = req.body;
    if (!userId || !friendId) return res.status(400).json({ success: false, message: "userId and friendId required" });
    if (userId === friendId) return res.status(400).json({ success: false, message: "Cannot add yourself" });

    const [user, friend] = await Promise.all([User.findById(userId), User.findById(friendId)]);
    if (!user || !friend) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.friends.includes(friendId)) { user.friends.push(friendId); await user.save(); }
    if (!friend.friends.includes(userId)) { friend.friends.push(userId); await friend.save(); }

    res.json({ success: true, friendCount: user.friends.length });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function removeFriend(req, res) {
  try {
    const { userId, friendId } = req.body;
    if (!userId || !friendId) return res.status(400).json({ success: false, message: "userId and friendId required" });

    const [user, friend] = await Promise.all([User.findById(userId), User.findById(friendId)]);
    if (!user || !friend) return res.status(404).json({ success: false, message: "User not found" });

    user.friends = user.friends.filter(id => id !== friendId);
    friend.friends = friend.friends.filter(id => id !== userId);
    await Promise.all([user.save(), friend.save()]);

    res.json({ success: true, friendCount: user.friends.length });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = { addFriend, removeFriend };
