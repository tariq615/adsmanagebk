import mongoose from "mongoose";

const adminpostSchema = new mongoose.Schema(
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" }, 
    views: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

export const adminpostModel = mongoose.model("adminPost", adminpostSchema);