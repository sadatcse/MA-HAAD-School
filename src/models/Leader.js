import mongoose from 'mongoose';

export const LEADER_SLUGS = ['ceo-message', 'principal-message'];

// CEO's and Principal's messages (/about/ceo-message, /about/principal-message) — Dashboard → CEO & Principal
const LeaderSchema = new mongoose.Schema(
  {
    slug: { type: String, enum: LEADER_SLUGS, required: true, unique: true },
    name: { type: String, trim: true, default: '', maxlength: 120 },
    role: { type: String, trim: true, default: '', maxlength: 120 },
    photo: { type: String, trim: true, default: '', maxlength: 1000 },
    heading: { type: String, trim: true, default: '', maxlength: 200 },
    // Short quote used on cards and in search results
    excerpt: { type: String, trim: true, default: '', maxlength: 600 },
    // Full message — paragraphs separated by a blank line
    body: { type: String, trim: true, default: '', maxlength: 20000 },
  },
  { timestamps: true }
);

export default mongoose.models.Leader || mongoose.model('Leader', LeaderSchema);
