import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: String, // Post/Ad title
    content: String, // Short preview (e.g., first 50 chars of post)
    type: { type: String, enum: ["post", "ad"] }, // Post or Ad notification
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Publisher/Advertiser ID
    status: { type: String, enum: ["read", "unread"], default: "unread" },
  },
  {
    timestamps: true,
  }
);

export const notificationModel = mongoose.model("Notification", notificationSchema);