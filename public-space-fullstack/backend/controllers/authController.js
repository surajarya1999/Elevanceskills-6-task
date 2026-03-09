const User = require("../models/User.js");
const LoginHistory = require("../models/LoginHistory.js");
const { parseUserAgent, isWithinMobileLoginWindow } = require("../lib/deviceDetect.js");
const { generateOTP, storeOTP, verifyOTP, sendOTPEmail } = require("../lib/otp.js");

async function login(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "127.0.0.1";
    const { browser, os, deviceType, isChrome, isMobile } = parseUserAgent(userAgent);

    // Rule 1: Mobile time restriction
    if (isMobile && !isWithinMobileLoginWindow()) {
      await LoginHistory.create({
        userId: user._id.toString(), email, browser, os, deviceType, ipAddress,
        status: "blocked",
        blockReason: "Mobile login only allowed between 10:00 AM – 1:00 PM",
      });
      return res.status(403).json({
        success: false, blocked: true,
        message: "Mobile login is only allowed between 10:00 AM and 1:00 PM.",
      });
    }

    // Rule 2: Chrome requires OTP
    if (isChrome) {
      const otp = generateOTP();
      storeOTP(email, otp);

      try { await sendOTPEmail(email, otp, user.name); } catch (e) { console.error("Email failed:", e.message); }

      await LoginHistory.create({
        userId: user._id.toString(), email, browser, os, deviceType, ipAddress, status: "otp_pending",
      });

      return res.json({
        success: true, requiresOTP: true,
        message: "OTP sent to your registered email. Please verify to continue.",
        demoOTP: otp, // Remove in production
      });
    }

    // Normal login
    await LoginHistory.create({
      userId: user._id.toString(), email, browser, os, deviceType, ipAddress, status: "success",
    });

    res.json({
      success: true, requiresOTP: false,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, friends: user.friends },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
}

async function verifyOTPHandler(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

    const isValid = verifyOTP(email, otp);
    if (!isValid) return res.status(401).json({ success: false, message: "Invalid or expired OTP. Please try again." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await LoginHistory.findOneAndUpdate(
      { email, status: "otp_pending" }, { status: "otp_verified" }, { sort: { loginAt: -1 } }
    );

    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, friends: user.friends },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
}

async function getLoginHistory(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    const history = await LoginHistory.find({ userId }).sort({ loginAt: -1 }).limit(20);
    res.json({ success: true, history });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch history" });
  }
}

module.exports = { login, verifyOTPHandler, getLoginHistory };
