const express = require("express");
const Post = require("../models/uploads");
const UserToken = require("../models/UserToken");
const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

/**
 * Setup Google OAuth2 Client
 */
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

/**
 * STEP 1: Authenticate User via Google OAuth (Link Calendar)
 */
router.get("/auth/google", (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
       "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.email"
    ],
  });
  res.redirect(url);
});

/**
 * STEP 2: Google Callback to Store Refresh Token
 */
router.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    await UserToken.findOneAndUpdate(
      { email: userInfo.email },
      { refreshToken: tokens.refresh_token },
      { upsert: true }
    );

    return res.send("✅ Google Calendar linked successfully for: " + userInfo.email);
  } catch (err) {
    console.error("❌ OAuth callback error:", err.message);
    return res.status(500).send("OAuth flow failed.");
  }
});

/**
 * GET /api/posts - Fetch all posts
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ status: "posted" }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Posts fetched successfully.",
      success: true,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch posts.",
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/posts/subcategory?category=...&subcategory=...
 */
router.get("/subcategory", async (req, res) => {
  const { category, subcategory } = req.query;

  try {
    const query = { status: "posted" };
    if (category) query.category = new RegExp(`^${category}$`, "i");
    if (subcategory) query.subCategory = new RegExp(`^${subcategory}$`, "i");

    const posts = await Post.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      message: posts.length
        ? "Filtered posts fetched successfully."
        : "No posts found for the specified category/subcategory.",
      success: true,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch filtered posts.",
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/posts/events?date=YYYY-MM-DD
 */
router.get("/events", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Event date is required in 'YYYY-MM-DD' format.",
    });
  }

  try {
    const events = await Post.find({
      status: "posted",
      eventDate: date,
    }).select("title location eventTime");

    return res.status(200).json({
      success: true,
      message: events.length ? "Events found." : "No events for this date.",
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch events.",
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/posts/add-to-calendar
 */
router.post("/add-to-calendar", async (req, res) => {
  try {
    const { title, description, location, eventDate, eventTime, email } = req.body;

    if (!title || !eventDate || !eventTime || !email) {
      return res.status(400).json({
        success: false,
        message: "Title, eventDate, eventTime, and user email are required.",
      });
    }

    // Fetch refresh token for user
    const user = await UserToken.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User has not linked Google Calendar yet.",
      });
    }

    // Setup user-specific OAuth client
    const userOAuthClient = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    userOAuthClient.setCredentials({ refresh_token: user.refreshToken });

    const userCalendar = google.calendar({ version: "v3", auth: userOAuthClient });

    const startDateTime = new Date(`${eventDate}T${eventTime}`);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    const event = {
      summary: title,
      location: location || "Online / TBA",
      description: description || "",
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
    };

    const calendarRes = await userCalendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return res.status(200).json({
      success: true,
      message: "Event added to your Google Calendar",
      link: calendarRes.data.htmlLink,
    });
  } catch (error) {
    // ✅ Log full error for debugging
    console.error("❌ Calendar Add Error:", error.response?.data || error.message || error);

    return res.status(500).json({
      success: false,
      message: "Failed to add event to calendar",
      error: error.message,
    });
  }
});

module.exports = router;