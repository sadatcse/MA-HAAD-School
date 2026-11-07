import mongoose from 'mongoose';

export const ENTRY_TYPES = ['holiday', 'vacation', 'exam', 'event', 'meeting'];
export const BOOK_SOURCES = ['NCTB', 'School'];

// Dates are stored as 'YYYY-MM-DD' strings (calendar days, no time zone)
const DATE = { type: String, match: [/^\d{4}-\d{2}-\d{2}$/, 'Dates must be YYYY-MM-DD'] };

const EntrySchema = new mongoose.Schema(
  {
    date: { ...DATE, required: true },
    end: { ...DATE, default: undefined },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    type: { type: String, enum: ENTRY_TYPES, default: 'holiday' },
    // Holidays only: National / Religious / School
    kind: { type: String, trim: true, default: '', maxlength: 40 },
    tentative: { type: Boolean, default: false },
  },
  { _id: false }
);

const BookSchema = new mongoose.Schema(
  { title: { type: String, required: true, trim: true, maxlength: 200 }, source: { type: String, enum: BOOK_SOURCES, default: 'NCTB' } },
  { _id: false }
);
const BookClassSchema = new mongoose.Schema(
  { name: { type: String, required: true, trim: true, maxlength: 120 }, books: { type: [BookSchema], default: [] } },
  { _id: false }
);
const BookLevelSchema = new mongoose.Schema(
  { level: { type: String, required: true, trim: true, maxlength: 120 }, classes: { type: [BookClassSchema], default: [] } },
  { _id: false }
);

// One school year: holidays (/campus/holidays), academic calendar (/campus/academic-calendar)
// and book list (/campus/books). The session marked `current` is the one shown on the website.
const AcademicSessionSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true, unique: true, min: 2000, max: 2100 },
    label: { type: String, trim: true, default: '', maxlength: 60 },
    // Weekly holidays (0 = Sunday … 6 = Saturday)
    weekend: { type: [Number], default: [5, 6] },
    // false = the website says the dates are a tentative plan
    confirmed: { type: Boolean, default: false },
    current: { type: Boolean, default: false },
    holidays: { type: [EntrySchema], default: [] },
    events: { type: [EntrySchema], default: [] },
    books: { type: [BookLevelSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.AcademicSession || mongoose.model('AcademicSession', AcademicSessionSchema);
