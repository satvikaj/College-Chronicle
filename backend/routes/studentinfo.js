const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// Route to fetch student details by email
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    console.log(`Fetching profile for email: ${email}`);

    const student = await Student.findOne({
      email: new RegExp(`^${email}$`, "i"),
    });

    if (!student) {
      console.log("Student not found in database");
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("Error fetching student details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to update student profile image
router.put("/:email/update-image", async (req, res) => {
  const { email } = req.params;
  const { image } = req.body;
console.log("Received image for update:", image?.substring(0, 100)); // Print first 100 chars
  try {
    const student = await Student.findOneAndUpdate(
      { email: new RegExp(`^${email}$`, "i") },
      { image },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Image updated successfully", student });
  } catch (err) {
    console.error("Error updating image:", err);
    res.status(500).json({ message: "Server error" });
  }

});

module.exports = router;
