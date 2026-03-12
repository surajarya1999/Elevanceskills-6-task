const User = require("../models/User.js");
const LoginHistory = require("../models/LoginHistory.js");
const { parseUserAgent, isWithinMobileLoginWindow } = require("../lib/deviceDetect.js");
const { generateOTP, storeOTP, verifyOTP, sendOTPEmail } = require("../lib/otp.js");

// Firebase Google login — frontend se naam/email aata hai
async function firebaseLogin(req, res) {
  try {
    const { name, email, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    // User already hai? Nahi toh auto-register
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || "User",
        email,
        avatar: avatar || "",
        friends: [],
      });
    }

    const userAgent = req.headers["user-agent"] || "";
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "127.0.0.1";
    const { browser, os, deviceType, isChrome, isMobile } = parseUserAgent(userAgent);

    // Rule 1: Mobile time restriction (10AM - 1PM only)
    if (isMobile && !isWithinMobileLoginWindow()) {
      await LoginHistory.create({
        userId: user._id.toString(),
        email, browser, os, deviceType, ipAddress,
        status: "blocked",
        blockReason: "Mobile login only allowed between 10:00 AM – 1:00 PM",
      });
      return res.status(403).json({
        success: false,
        blocked: true,
        message: "Mobile login sirf 10:00 AM – 1:00 PM ke beech allowed hai.",
      });
    }

    // Rule 2: Chrome users ko OTP chahiye
    if (isChrome) {
      const otp = generateOTP();
      storeOTP(email, otp);

      try {
        await sendOTPEmail(email, otp, user.name);
      } catch (e) {
        console.error("Email sending failed:", e.message);
        return res.status(500).json({
          success: false,
          message: "OTP email bhejne mein error aayi. Dobara try karo.",
        });
      }

      await LoginHistory.create({
        userId: user._id.toString(),
        email, browser, os, deviceType, ipAddress,
        status: "otp_pending",
      });

      return res.json({
        success: true,
        requiresOTP: true,
        message: `OTP bheja gaya hai ${email} par. Inbox check karo.`,
      });
    }

    // Normal login — non-Chrome browser
    await LoginHistory.create({
      userId: user._id.toString(),
      email, browser, os, deviceType, ipAddress,
      status: "success",
    });

    return res.json({
      success: true,
      requiresOTP: false,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        friends: user.friends,
      },
    });
  } catch (err) {
    console.error("firebaseLogin error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
}

async function verifyOTPHandler(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP required" });

    const isValid = verifyOTP(email, otp);
    if (!isValid)
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP. Please try again.",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    await LoginHistory.findOneAndUpdate(
      { email, status: "otp_pending" },
      { status: "otp_verified" },
      { sort: { loginAt: -1 } }
    );

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        friends: user.friends,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
}

async function getLoginHistory(req, res) {
  try {
    const { userId } = req.query;
    if (!userId)
      return res.status(400).json({ success: false, message: "userId required" });

    const history = await LoginHistory.find({ userId })
      .sort({ loginAt: -1 })
      .limit(20);
    res.json({ success: true, history });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch history" });
  }
}

module.exports = { firebaseLogin, verifyOTPHandler, getLoginHistory };
