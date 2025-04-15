// cloudinary.js (updated)
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs/promises';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Force HTTPS
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("No file path provided");
    }

    // Verify file exists
    await fs.access(localFilePath);
    
    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: "images_folder",
      use_filename: true,
      unique_filename: true
    });

    // Cleanup local file
    await fs.unlink(localFilePath);
    
    if (!response.secure_url) {
      throw new Error("Cloudinary upload failed - no URL returned");
    }

    return response;
  } catch (error) {
    // Cleanup local file if exists
    if (localFilePath) {
      await fs.unlink(localFilePath).catch(cleanupError => {
        console.error("File cleanup error:", cleanupError);
      });
    }
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export { uploadOnCloudinary };