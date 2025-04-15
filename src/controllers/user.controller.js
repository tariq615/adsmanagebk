import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { blacklistModel } from "../models/blacklistToken.model.js";
import { postModel } from "../models/post.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, country } = req.body;

  if (
    [name, email, password, role, country].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    throw new ApiError(400, "user already exists");
  }

  const avatarLocalpath = req.file?.path;

  if (!avatarLocalpath) {
    throw new ApiError(400, "avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalpath);

  // console.log(avatar);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is Required");
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    avatar: avatar.url,
    role,
    country,
  });
  // console.log(user);

  if (!user) {
    throw new ApiError(500, "tryagain later");
  }

  const token = await user.generateAuthToken();

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(201)
    .cookie("token", token, options)
    .json(
      new ApiResponse(201, { user, token }, "user registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await userModel.findOne({ role, email });

  console.log(user);

  if (!user) {
    throw new ApiError(404, "invalid email or password");
  }

  const isPasswordValid = await await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid email or password");
  }

  const token = user.generateAuthToken();

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, { user, token }, "loggedin successfully"));
});

const getUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetched successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
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

const createPost = asyncHandler(async (req, res) => {
  const { title, subtitle, content } = req.body;

  if ([title, subtitle, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "all fields are required");
  }

  const imageLocalpath = req.file?.path;

  if (!imageLocalpath) {
    throw new ApiError(400, "image file is required");
  }

  const image = await uploadOnCloudinary(imageLocalpath);

  // console.log(image);

  if (!image) {
    throw new ApiError(400, "image file is Required");
  }

  const post = await postModel.create({
    title,
    subtitle,
    content,
    image: image.url,
    createdBy: req.user._id,
  });
  // console.log(user);

  if (!post) {
    throw new ApiError(500, "try again later something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { post }, "post created successfully"));
});


export {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  createPost
};
