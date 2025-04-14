import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    role: {
      type: String,
      enum: ["publisher", "advertiser"],
      default: "publisher",
    },
    country: {
      type: String,
      required: true,
    }, // For "Users by Country" chart
    isSubscribed: { type: Boolean, default: false }, // Track subscriptions
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.AUTH_TOKEN_SECRET, {
    expiresIn: process.env.AUTH_TOKEN_EXPIRY,
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};


export const userModel = mongoose.model("User", userSchema);