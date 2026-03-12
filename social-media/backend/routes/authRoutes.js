const express = require("express");
const { firebaseLogin, verifyOTPHandler, getLoginHistory } = require("../controllers/authController.js");
const router = express.Router();

router.post("/login", firebaseLogin);
router.post("/verify-otp", verifyOTPHandler);
router.get("/history", getLoginHistory);

module.exports = router;
