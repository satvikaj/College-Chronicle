const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  studentid: { type: String, required: true },
  branch: { type: String, required: true },
  phoneno: { type: String, required: true },
  image: { type: String }, // Store image as a base64 string
});

module.exports = mongoose.model("Student", studentSchema);