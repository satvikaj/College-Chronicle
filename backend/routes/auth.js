const express = require("express");const Student = require("../models/student");
const Coordinator = require("../models/coordinator");

const router = express.Router();


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received data:", req.body);
  try {
    // Check in students collection
    const student = await Student.findOne({ email });
    if (student && student.password === password) {
      return res.json({
        email: student.email, // Send email in response
        redirectTo: "/studentdashboard",
        role: "student",
      });
    }

    // Check in coordinators collection
    const coordinator = await Coordinator.findOne({ email });
    if (coordinator && coordinator.password === password) {
      return res.json({
        email: coordinator.email, // Send email in response
        redirectTo: "/coordinatordashboard",
        role: "coordinator",
      });
    }

    // If no match found for both students and coordinators
    res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Error:", error); // Log any error
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;


// Login Route