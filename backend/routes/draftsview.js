const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/uploads"); // Post model
const router = express.Router();
const multer = require("multer");

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Fetch drafts filtered by uploaderEmail
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

    // Fetch drafts
    const drafts = await Post.find({
      uploaderEmail: new RegExp(`^${email}$`, "i"),
      status: "draft",
    }).sort({ createdAt: -1 });

    if (!drafts.length) {
      return res.status(404).json({ message: "No drafts found" });
    }

    res.status(200).json(drafts);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete a specific draft by ID
router.delete("/:draftId", async (req, res) => {
  const { draftId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(draftId)) {
      return res.status(400).json({ error: "Invalid draft ID" });
    }

    const deletedDraft = await Post.findByIdAndDelete(draftId);

    if (!deletedDraft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    res.status(200).json({ message: "Draft deleted successfully" });
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch a specific draft by ID for editing
router.get("/edit/:draftId", async (req, res) => {
  const { draftId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(draftId)) {
      return res.status(400).json({ error: "Invalid draft ID" });
    }

    const draft = await Post.findById(draftId);
    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    res.status(200).json(draft);
  } catch (error) {
    console.error("❌ Error fetching draft:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Update a draft (Save changes or Post)

// Update a draft (Save changes or Post)
router.put("/update/:draftId", upload.array("media"), async (req, res) => {
  const { draftId } = req.params;
  console.log("🔹 Received request to update draft:", draftId);
  console.log("🔹 Request body:", req.body);
  console.log("🔹 Uploaded files:", req.files || "No files uploaded");

  try {
    if (!mongoose.Types.ObjectId.isValid(draftId)) {
      console.error("❌ Invalid draft ID:", draftId);
      return res.status(400).json({ error: "Invalid draft ID" });
    }

    const existingPost = await Post.findById(draftId);
    if (!existingPost) {
      console.error("❌ Draft not found for ID:", draftId);
      return res.status(404).json({ message: "Draft not found" });
    }

    console.log("✅ Draft found. Updating...");

    // Ensure required fields are present
    const { title, description, category, subCategory, status, link, uploaderEmail } = req.body;
    if (!title || !description || !category || !status || !uploaderEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prevent accidental deletion
    if (status === "posted") {
      console.log("🚀 Post is being published, but NOT deleted!");
    }

    existingPost.title = title;
    existingPost.description = description;
    existingPost.category = category;
    existingPost.subCategory = subCategory || "";
    existingPost.status = status; // Updates status to "posted" or keeps it as "draft"
    existingPost.link = link || "";
    existingPost.uploaderEmail = uploaderEmail;

    // Handle media files
    if (req.files && req.files.length > 0) {
      console.log("🔹 Updating media...");
      existingPost.media = req.files.map((file) => ({
        url: file.path,
        type: file.mimetype,
      }));
    }

    // Save the updated post (NOT delete)
    const updatedPost = await existingPost.save();
    console.log("✅ Draft updated successfully:", updatedPost);

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("❌ Error updating draft:", error);
    res.status(500).json({ error: "Error updating draft", details: error.message });
  }
});


module.exports = router;