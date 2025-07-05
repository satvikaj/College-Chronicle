const express = require("express");
const router = express.Router();
const Coordinator = require("../models/coordinator"); // Import the Coordinator model

// Route to fetch coordinator details by email
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  const escapedEmail = email.replace(/\./g, "\\."); // Escape dots in the email

  try {
    console.log(`Fetching profile for email: ${email}`); // Debug log

    const coordinator = await Coordinator.findOne({
      email: new RegExp(`^${escapedEmail}$`, "i"),
    });

    if (!coordinator) {
      console.log("Coordinator not found in database");
      return res.status(404).json({ message: "Coordinator not found" });
    }

    res.json(coordinator);
  } catch (err) {
    console.error("Error fetching coordinator details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to update coordinator profile image
router.put("/:email/update-image", async (req, res) => {
  const { email } = req.params;
  const { image } = req.body;

  try {
    console.log("Received image for update:", image?.substring(0, 100)); // Optional debug log

    const coordinator = await Coordinator.findOneAndUpdate(
      { email: new RegExp(`^${email}$`, "i") },
      { image },
      { new: true }
    );

    if (!coordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    res.json({ message: "Image updated successfully", coordinator });
  } catch (err) {
    console.error("Error updating image:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
