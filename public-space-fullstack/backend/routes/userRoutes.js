const express = require("express");
const { getUsers, seedUsers } = require("../controllers/userController.js");
const router = express.Router();

router.get("/", getUsers);
router.post("/seed", seedUsers);

module.exports = router;
