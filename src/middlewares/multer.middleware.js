// multer.config.js (updated)
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/ApiError.js';
import fs from 'fs/promises';
import path from 'path';

// Create temp directory if not exists
const createTempDir = async () => {
  const tempDir = path.join(process.cwd(), 'public', 'temp');
  try {
    await fs.mkdir(tempDir, { recursive: true });
  } catch (error) {
    console.error("Error creating temp directory:", error);
    throw new Error("Failed to create upload directory");
  }
};

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      await createTempDir();
      cb(null, './public/temp');
    } catch (error) {
      cb(new ApiError(500, "Server file system error"), false);
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueFilename = `${uuidv4()}${ext}`;
    cb(null, uniqueFilename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only image files are allowed (JPEG, PNG, GIF)"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  }
});