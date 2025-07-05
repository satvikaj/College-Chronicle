const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  type: { type: String, required: false },
  url: { type: String, required: false },
});

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    uploaderEmail: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    status: { type: String, enum: ["posted", "draft"], required: true },
    link: { type: String },
    eventName: { type: String },
    eventDate: { type: String },
    eventTime: { type: String },
    location: { type: String },
    media: [mediaSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);