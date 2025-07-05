const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: your cloud name,  // Set in .env
  api_key: your api key, // Set in .env
  api_secret: 'your api secret',
});

// Determine resource type for Cloudinary
const determineResourceType = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf") return "raw";
  if (ext === ".mp4") return "video";
  return "image";
};

// Setup storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const resourceType = determineResourceType(file);
    return {
      folder: "college-blog",
      resource_type: resourceType,
      public_id: path.parse(file.originalname).name,
    };
  },
});

// Export upload middleware
const upload = multer({ storage });

module.exports = { cloudinary, upload };
