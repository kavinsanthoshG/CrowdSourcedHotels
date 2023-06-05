const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_NAME}`,
  api_key: `${process.env.CLOUDINARY_KEY}`,
  api_secret: `${process.env.CLOUDINARY_SECRET}`,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "yelpCamp",
    allowedFormats: ["png", "jpg", "jpeg"],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalFilename = file.originalname;
      const uniqueFilename = `${timestamp}-${originalFilename}`;
      return uniqueFilename;
    },
  },
});

module.exports = { cloudinary, storage };
