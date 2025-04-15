import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { adminModel } from "../models/admin.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { blacklistModel } from "../models/blacklistToken.model.js";
import { adsModel } from "../models/advertisement.model.js";
import { userModel } from "../models/user.models.js";
import { adminpostModel } from "../models/adminPost.model.js";


const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "all fields are required");
  }

  const isadminAlreadyExist = await adminModel.findOne({ email });

  if (isadminAlreadyExist) {
    throw new ApiError(401, "admin already exists");
  }

  const avatarLocalpath = req.file?.path;

  if (!avatarLocalpath) {
    throw new ApiError(402, "avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalpath);

  console.log(avatar);

  if (!avatar) {
    throw new ApiError(403, "Avatar file is Required");
  }

  const hashedPassword = await adminModel.hashPassword(password);

  const admin = await adminModel.create({
    name,
    email,
    password: hashedPassword,
    avatar: avatar.url,
  });
  // console.log(admin);

  if (!admin) {
    throw new ApiError(500, "tryagain later");
  }

  const token = await admin.generateAuthToken();

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(201)
    .cookie("token", token, options)
    .json(
      new ApiResponse(201, { admin, token }, "admin registered successfully")
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "password or email is required");
  }

  const admin = await adminModel.findOne({ email });

  //   console.log(admin);

  if (!admin) {
    throw new ApiError(404, "invalid email or password");
  }

  const isPasswordValid = await admin.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid email or password");
  }

  const token = admin.generateAuthToken();

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, { admin, token }, "loggedin successfully"));
});

const getAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.admin, "admin fetched successfully"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.replace("Bearer ", "")
      : undefined);

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  await blacklistModel.create({
    token,
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, {}, "logged out successfully"));
});

const adminDashboardStats = asyncHandler(async (req, res) => {
  const adStats = await adsModel.aggregate([
    {
      $match: { status: "approved" },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$revenue" },
        totalImpressions: { $sum: "$impressions" },
        totalClicks: { $sum: "$clicks" },
        totalAds: { $sum: 1 },
      },
    },
  ]);

  // Aggregate user statistics
  const userStats = await userModel.aggregate([
    {
      $facet: {
        totalSubscribers: [
          { $match: { isSubscribed: true } },
          { $count: "count" },
        ],
        usersByCountry: [
          {
            $group: {
              _id: "$country",
              count: { $sum: 1 },
            },
          },
        ],
        recentUsers: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              country: 1,
              role: 1,
            },
          },
        ],
        recentSubscribers: [
          { $match: { isSubscribed: true } },
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
        ],
      },
    },
  ]);

  // Extract and format results
  const stats = {
    totalRevenue: adStats[0]?.totalRevenue || 0,
    totalSubscribers: userStats[0]?.totalSubscribers[0]?.count || 0,
    usersByCountry: userStats[0]?.usersByCountry || [],
    recentUsers: userStats[0]?.recentUsers || [],
    recentSubscribers: userStats[0]?.recentSubscribers || [],
    totalAds: adStats[0]?.totalAds || 0,
    totalClicks: adStats[0]?.totalClicks || 0,
    totalImpressions: adStats[0]?.totalImpressions || 0,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Dashboard statistics fetched successfully")
    );
});

const createPost = asyncHandler(async (req, res) => {
  const { title, subtitle, content } = req.body;

  if ([title, subtitle, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "all fields are required");
  }

  const fileBuffer = req.file?.buffer;
  if (!fileBuffer) {
    throw new ApiError(400, "Image file is required");
  }

  const image = await uploadOnCloudinary(fileBuffer);

  const post = await adminpostModel.create({
    title,
    subtitle,
    content,
    image: image.url,
    createdBy: req.admin._id,
  });

  res.status(201).json(new ApiResponse(201, { post }, "Post created successfully"));
});


const getPost = asyncHandler(async (req, res) => {
    const posts = await adminpostModel.find()
      .populate('createdBy', 'name email') // Populate admin details
      .sort({ createdAt: -1 }); // Newest first

      if(!posts) {
        throw new ApiError(404, "error while fetching posts");
      }

    res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));

});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel
    .find()
    .select("-password -__v") // Exclude sensitive fields
    .sort({ createdAt: -1 });

  if (!users) {
    throw new ApiError(500, "please try again");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "users fetched successfully"));
});
export { registerAdmin, loginAdmin, getAdmin, logoutAdmin, adminDashboardStats, createPost, getPost, getAllUsers };
