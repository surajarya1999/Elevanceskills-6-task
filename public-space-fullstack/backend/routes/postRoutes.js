const express = require("express");
const { getPosts, createPost, likePost, commentPost, sharePost } = require("../controllers/postController.js");
const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.post("/:id/like", likePost);
router.post("/:id/comment", commentPost);
router.post("/:id/share", sharePost);

module.exports = router;
