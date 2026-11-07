import mongoose from 'mongoose';

export const NOTICE_CATEGORIES = ['general', 'admission', 'exam', 'holiday', 'event', 'result', 'important'];
export const NOTICE_STATUSES = ['published', 'draft'];

// Notice board: listed on /notices, the home page and the scrolling bar under the menu
const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 250 },
    category: { type: String, enum: NOTICE_CATEGORIES, default: 'general' },
    summary: { type: String, trim: true, default: '', maxlength: 500 },
    body: { type: String, trim: true, default: '', maxlength: 20000 },
    // Date shown on the notice (can differ from when it was typed in)
    date: { type: Date, default: Date.now },
    // Optional photo shown on the notice card and page (e.g. /images/school/… or https://…)
    image: { type: String, trim: true, default: '' },
    // Optional link to a PDF / image / Google Drive file
    attachmentUrl: { type: String, trim: true, default: '' },
    status: { type: String, enum: NOTICE_STATUSES, default: 'published' },
    // Show in the scrolling notice bar
    inTicker: { type: Boolean, default: true },
    pinned: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Test data added by `npm run seed-notices` (removed with `-- --remove`)
    sample: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

NoticeSchema.index({ status: 1, pinned: -1, date: -1 });

export default mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
