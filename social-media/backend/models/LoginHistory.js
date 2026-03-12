const mongoose = require("mongoose");

const LoginHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  browser: { type: String, required: true },
  os: { type: String, required: true },
  deviceType: { type: String, enum: ["desktop", "laptop", "mobile"], required: true },
  ipAddress: { type: String, required: true },
  status: { type: String, enum: ["success", "blocked", "otp_pending", "otp_verified"], default: "success" },
  blockReason: { type: String, default: "" },
  loginAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.LoginHistory || mongoose.model("LoginHistory", LoginHistorySchema);
