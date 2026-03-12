const express = require("express");
const { addFriend, removeFriend } = require("../controllers/friendController.js");
const router = express.Router();

router.post("/add", addFriend);
router.post("/remove", removeFriend);

module.exports = router;
