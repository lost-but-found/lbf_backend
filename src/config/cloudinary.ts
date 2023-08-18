require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  const base64Image = file.toString("base64"); // Convert the buffer to a Base64 string
  try {
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      {
        upload_preset: "ml_default",
      }
    );

    return result.secure_url;
    // return result.url;
  } catch (error) {
    throw new Error("Error uploading image to Cloudinary");
  }
};

module.exports = { cloudinary, uploadImageToCloudinary };
