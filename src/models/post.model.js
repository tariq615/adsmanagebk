import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    image: {
        type: String, // cloudinary url
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        required: true,
        trim: true,
    } ,
    content:  {
        type: String,
        required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Publisher ID
    status: { type: String, enum: ["active", "flagged"], default: "active" },
    views: { type: Number, default: 0 },
    flaggedReason: String, // Reason for flagging (if status=flagged)
  },
  {
    timestamps: true,
  }
);

export const postModel = mongoose.model("Post", postSchema);
