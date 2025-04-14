import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.models.js";
import { adminModel } from "../models/admin.model.js";
import { blacklistModel } from "../models/blacklistToken.model.js";


export const authUser = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.replace("Bearer ", "")
        : undefined);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    
    const blacklist = await blacklistModel.findOne({
      token: token
    });

    if (blacklist) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    const user = await userModel.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const authAdmin = asyncHandler(async (req, _, next) => {
    try {
      const token =
        req.cookies?.token ||
        (req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization.replace("Bearer ", "")
          : undefined);
  
      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }
      
      const blacklist = await blacklistModel.findOne({
        token: token
      });
  
      if (blacklist) {
        throw new ApiError(401, "Unauthorized request");
      }
  
      const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
      const admin = await adminModel.findById(decodedToken?._id);
  
      if (!admin) {
        throw new ApiError(401, "Invalid Access Token");
      }
  
      req.admin = admin;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid Access Token");
    }
  });