const mongoose = require("mongoose");

const coordinatorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  affiliation: { type: String, required: true },
  image: { type: String },  // Store the image as a binary buffer
});

module.exports = mongoose.model("Coordinator", coordinatorSchema);