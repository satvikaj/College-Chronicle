const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cors = require("cors");
const Post = require("../models/uploads");

const router = express.Router();

router.use(cors());

cloudinary.config({
  cloud_name: your cloud name,  // Set in .env
  api_key: your api key, // Set in .env
  api_secret: 'your api secret',
});

const path = require("path");

const determineResourceType = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf") return "raw";
  if (ext === ".mp4") return "video";
  return "image"; // or use "auto" if you want Cloudinary to decide for images
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const resourceType = determineResourceType(file);

    return {
      folder: "uploads",
      resource_type: resourceType,
      public_id: path.parse(file.originalname).name,
    };
  },
});


const upload = multer({ storage });

// router.post("/create-post", upload.array("media", 10), async (req, res) => {
//   try {
//     const { draftId, title, description, uploaderEmail, category, subCategory, status, link } = req.body;

//     if (!title || !description || !category || !uploaderEmail) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     const media = req.files.map((file) => ({ url: file.path, type: file.mimetype }));

//     let post;
//     if (draftId) {
//       post = await Post.findByIdAndUpdate(
//         draftId,
//         { title, description, category, subCategory, media, status, link },
//         { new: true }
//       );
//     } else {
//       post = new Post({ title, description, uploaderEmail, category, subCategory, media, status, link });
//       await post.save();
//     }

//     res.status(201).json({ message: "Post saved successfully!", post });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Failed to process request" });
//   }
// });


router.post("/create-post", upload.array("media", 10), async (req, res) => {
  try {
    const {
      draftId,
      title,
      description,
      uploaderEmail,
      category,
      subCategory,
      status,
      link,
      eventName,
      eventDate,
      eventTime,
      location,
    } = req.body;

    if (!title || !description || !category || !uploaderEmail) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const media = req.files.map((file) => ({
      url: file.path,
      type: file.mimetype,
    }));

    let post;
    if (draftId) {
      post = await Post.findByIdAndUpdate(
        draftId,
        {
          title,
          description,
          category,
          subCategory,
          media,
          status,
          link,
          eventName,
          eventDate,
          eventTime,
          location,
        },
        { new: true }
      );
    } else {
      post = new Post({
        title,
        description,
        uploaderEmail,
        category,
        subCategory,
        media,
        status,
        link,
        eventName,
        eventDate,
        eventTime,
        location,
      });
      await post.save();
    }

    res.status(201).json({ message: "Post saved successfully!", post });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});


module.exports = router;
