import multer from "multer";
import { ApiError } from '../utils/ApiError.js';

const storage = multer.memoryStorage(); // Store files in memory (RAM)

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only image files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
