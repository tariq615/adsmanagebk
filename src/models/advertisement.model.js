import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
    image: {
        type: String, // cloudinary url
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle:{
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Advertiser ID
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    clicks: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }, // Total revenue generated
    impressions: { type: Number, default: 0 }, // Times ad was shown
  },
  {
    timestamps: true,
  }
);

export const adsModel = mongoose.model('Advertisement', adSchema);