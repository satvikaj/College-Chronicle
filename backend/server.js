const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const postRoutes = require("./routes/posts");// Post routes
const authRoutes = require("./routes/auth");  // Authentication routes
const fetchRoutes = require("./routes/fetch");
const stuprofileRoutes = require("./routes/studentinfo");
const postviewRoutes = require("./routes/postview");
const corprofileRoutes = require("./routes/coordinatorinfo");
const draftviewRoutes = require("./routes/draftsview");


dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "10mb" })); // ✅ Increase payload limit
app.use(cors({ origin: "*" })); // Allow all origins

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/posts",postRoutes);
app.use("/fetch", fetchRoutes); // Post routes
app.use("/studentinfo", stuprofileRoutes);
app.use("/postview",postviewRoutes);
app.use("/coordinatorinfo",corprofileRoutes);
app.use("/draftsview",draftviewRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});