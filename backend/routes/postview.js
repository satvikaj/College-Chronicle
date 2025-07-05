const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/uploads"); // Post model
const router = express.Router();

// Fetch posts filtered by uploaderEmail
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Fetch posts with case-insensitive matching for uploaderEmail
    const posts = await Post.find({
      uploaderEmail: new RegExp(`^${email}$`, "i"),
      status: "posted"
    }).sort({ createdAt: -1 });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete a specific post by ID
router.delete("/:postId", async (req, res) => {
  console.log("DELETE request received for postId:", req.params.postId);
  const { postId } = req.params;

  try {
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (!deletedPost) {
          console.log("Post not found for ID:", postId);
          return res.status(404).json({ message: "Post not found" });
      }
      console.log("Post deleted successfully:", deletedPost);
      res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;