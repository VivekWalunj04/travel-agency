const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Package title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      // e.g. "7 Days / 6 Nights"
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    gallery: [{ type: String }],
    highlights: [{ type: String }],
    included: [{ type: String }],
    notIncluded: [{ type: String }],
    maxGroupSize: {
      type: Number,
      default: 15,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Hard'],
      default: 'Easy',
    },
    category: {
      type: String,
      enum: ['Adventure', 'Beach', 'Cultural', 'Wildlife', 'Cruise', 'Mountain', 'City'],
      default: 'Cultural',
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// ─── Text search index ────────────────────────────────────────────────────────
packageSchema.index({ title: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Package', packageSchema);
