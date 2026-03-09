const express = require("express");
const { login, verifyOTPHandler, getLoginHistory } = require("../controllers/authController.js");
const router = express.Router();

router.post("/login", login);
router.post("/verify-otp", verifyOTPHandler);
router.get("/history", getLoginHistory);

module.exports = router;
