import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// 👇 Diagnostic log for debugging
console.log("✅ CLOUDINARY CONFIG", {
  cloud_name: `"${process.env.CLOUDINARY_CLOUD_NAME}"`,
  api_key: `"${process.env.CLOUDINARY_API_KEY}"`,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "[exists]" : "[missing]"
});


export const uploadOnCloudinary = async (fileBuffer) => {
  try {
    const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

    const response = await cloudinary.uploader.upload(base64Image, {
      resource_type: "image",
      folder: "images_folder",
    });

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
