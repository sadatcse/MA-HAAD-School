import mongoose from 'mongoose';

// Photo Gallery (/gallery and the home page preview) — managed in Dashboard → Photo Gallery
const GalleryPhotoSchema = new mongoose.Schema(
  {
    src: { type: String, required: [true, 'Image is required'], trim: true, maxlength: 1000 },
    title: { type: String, trim: true, default: '', maxlength: 200 },
    category: { type: String, trim: true, default: 'Campus Life', maxlength: 60 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    // Lower numbers come first
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

GalleryPhotoSchema.index({ order: 1, createdAt: -1 });

export default mongoose.models.GalleryPhoto || mongoose.model('GalleryPhoto', GalleryPhotoSchema);
