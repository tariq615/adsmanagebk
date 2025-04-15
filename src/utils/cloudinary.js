import {v2 as cloudinary} from "cloudinary"
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadOnCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer || buffer.length === 0) {
      reject(new Error("Empty buffer provided"));
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "images_folder" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error.message);
          reject(new ApiError(500, "Image upload failed"));
        } else {
          if (!result?.secure_url) {
            reject(new ApiError(500, "No URL returned from Cloudinary"));
          } else {
            resolve(result);
          }
        }
      }
    );

    const bufferStream = streamifier.createReadStream(buffer);
    bufferStream.on('error', (err) => {
      console.error("Buffer Stream Error:", err);
      reject(new ApiError(500, "Error processing image"));
    });

    bufferStream.pipe(uploadStream);
  });
}