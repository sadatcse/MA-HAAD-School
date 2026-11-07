// Website content managed from the dashboard: photo gallery, teachers & staff, CEO / Principal
// messages and academic sessions (holidays, academic calendar, book list).
import { cache } from 'react';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import GalleryPhoto from '@/models/GalleryPhoto';
import StaffMember, { STAFF_GROUPS } from '@/models/StaffMember';
import Leader, { LEADER_SLUGS } from '@/models/Leader';
import AcademicSession, { ENTRY_TYPES, BOOK_SOURCES } from '@/models/AcademicSession';
import { messages as defaultMessages } from '@/data/school';
import * as fallbackCalendar from '@/data/calendar';
import * as fallbackBooks from '@/data/books';
import { HttpError } from '@/server/http';
import { str, toPlain } from '@/server/validate';
import { replaceUpload, deleteUpload } from '@/server/storage';

const validId = (id, what = 'Item') => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, `${what} not found.`);
  return id;
};

// Image links: uploads (/uploads/…), site images (/images/…) or https:// links
function imageUrl(value, label = 'image') {
  const url = str(value, 1000);
  if (url && !/^(https:\/\/|\/)/i.test(url)) throw new HttpError(400, `The ${label} link must start with https:// or /`);
  return url;
}
const int = (value, fallback = 0) => (Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback);

// Saves a new order: ids[0] gets order 0, ids[1] order 1 …
async function saveOrder(Model, ids, filter = {}) {
  if (!Array.isArray(ids) || ids.some((id) => !mongoose.isValidObjectId(id))) throw new HttpError(400, 'Send the new order as a list of ids.');
  await Model.bulkWrite(ids.map((id, order) => ({ updateOne: { filter: { _id: id, ...filter }, update: { $set: { order } } } })));
}

// ---------- Photo gallery ----------

const GALLERY_SORT = { order: 1, createdAt: -1 };

export async function listGallery() {
  await connectDB();
  return toPlain(await GalleryPhoto.find().sort(GALLERY_SORT).lean());
}

function cleanPhoto(input, { partial = false } = {}) {
  const out = {};
  if (!partial || 'src' in input) {
    out.src = imageUrl(input.src);
    if (!out.src) throw new HttpError(400, 'Upload a photo first.');
  }
  if (!partial || 'title' in input) out.title = str(input.title, 200);
  if (!partial || 'category' in input) out.category = str(input.category, 60) || 'Campus Life';
  if ('width' in input) out.width = Math.max(int(input.width), 0);
  if ('height' in input) out.height = Math.max(int(input.height), 0);
  if ('order' in input) out.order = int(input.order);
  return out;
}

export async function createPhoto(input = {}) {
  await connectDB();
  const data = cleanPhoto(input);
  // New photos go to the top of the gallery
  if (!('order' in data)) {
    const first = await GalleryPhoto.findOne().sort({ order: 1 }).select('order').lean();
    data.order = (first?.order ?? 1) - 1;
  }
  return toPlain(await GalleryPhoto.create(data));
}

export async function updatePhoto(id, input = {}) {
  await connectDB();
  const photo = await GalleryPhoto.findById(validId(id, 'Photo'));
  if (!photo) throw new HttpError(404, 'Photo not found.');
  const data = cleanPhoto(input, { partial: true });
  const oldSrc = photo.src;
  photo.set(data);
  await photo.save();
  await replaceUpload(oldSrc, photo.src);
  return toPlain(photo);
}

export async function removePhoto(id) {
  await connectDB();
  const photo = await GalleryPhoto.findByIdAndDelete(validId(id, 'Photo')).lean();
  if (!photo) throw new HttpError(404, 'Photo not found.');
  await deleteUpload(photo.src);
  return toPlain({ _id: photo._id, title: photo.title });
}

export async function orderGallery(ids) {
  await connectDB();
  await saveOrder(GalleryPhoto, ids);
  return listGallery();
}

// ---------- Teachers & staff ----------

const STAFF_SORT = { order: 1, name: 1 };

export async function listStaff(group) {
  await connectDB();
  const filter = STAFF_GROUPS.includes(group) ? { group } : {};
  return toPlain(await StaffMember.find(filter).sort({ group: 1, ...STAFF_SORT }).lean());
}

function cleanMember(input) {
  const name = str(input.name, 120);
  if (!name) throw new HttpError(400, 'Name is required.');
  if (!STAFF_GROUPS.includes(input.group)) throw new HttpError(400, 'Choose which list this person belongs to.');
  return {
    group: input.group,
    name,
    designation: str(input.designation, 120),
    subject: str(input.subject, 120),
    qualification: str(input.qualification, 200),
    photo: imageUrl(input.photo, 'photo'),
    ...('order' in input && { order: int(input.order) }),
  };
}

export async function createMember(input = {}) {
  await connectDB();
  const data = cleanMember(input);
  if (!('order' in data)) {
    const last = await StaffMember.findOne({ group: data.group }).sort({ order: -1 }).select('order').lean();
    data.order = (last?.order ?? -1) + 1;
  }
  return toPlain(await StaffMember.create(data));
}

export async function updateMember(id, input = {}) {
  await connectDB();
  const member = await StaffMember.findById(validId(id, 'Person'));
  if (!member) throw new HttpError(404, 'Person not found.');
  const oldPhoto = member.photo;
  member.set(cleanMember({ group: member.group, ...input }));
  await member.save();
  await replaceUpload(oldPhoto, member.photo);
  return toPlain(member);
}

export async function removeMember(id) {
  await connectDB();
  const member = await StaffMember.findByIdAndDelete(validId(id, 'Person')).lean();
  if (!member) throw new HttpError(404, 'Person not found.');
  await deleteUpload(member.photo);
  return toPlain({ _id: member._id, name: member.name });
}

export async function orderStaff(group, ids) {
  if (!STAFF_GROUPS.includes(group)) throw new HttpError(400, 'Unknown list.');
  await connectDB();
  await saveOrder(StaffMember, ids, { group });
  return listStaff(group);
}

// ---------- CEO & Principal messages ----------

const splitParagraphs = (text) => String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

// Saved message merged over the built-in text in src/data/school.js
function mergeLeader(slug, doc) {
  const base = defaultMessages[slug];
  if (!doc) return { ...base, body: base.paragraphs.join('\n\n') };
  const paragraphs = splitParagraphs(doc.body);
  return {
    ...base,
    name: doc.name,
    role: doc.role || base.role,
    photo: doc.photo,
    heading: doc.heading || base.heading,
    excerpt: doc.excerpt || base.excerpt,
    paragraphs: paragraphs.length ? paragraphs : base.paragraphs,
    body: paragraphs.length ? paragraphs.join('\n\n') : base.paragraphs.join('\n\n'),
    updatedAt: doc.updatedAt,
  };
}

export async function listLeaders() {
  await connectDB();
  const docs = await Leader.find().lean();
  return toPlain(Object.fromEntries(LEADER_SLUGS.map((slug) => [slug, mergeLeader(slug, docs.find((d) => d.slug === slug))])));
}

export async function getLeader(slug) {
  if (!LEADER_SLUGS.includes(slug)) return null;
  await connectDB();
  return toPlain(mergeLeader(slug, await Leader.findOne({ slug }).lean()));
}

export async function updateLeader(slug, input = {}) {
  if (!LEADER_SLUGS.includes(slug)) throw new HttpError(404, 'Message not found.');
  await connectDB();
  const body = splitParagraphs(str(input.body, 20000)).join('\n\n');
  if (!body) throw new HttpError(400, 'Write the message.');
  const data = {
    name: str(input.name, 120),
    role: str(input.role, 120),
    photo: imageUrl(input.photo, 'photo'),
    heading: str(input.heading, 200),
    excerpt: str(input.excerpt, 600),
    body,
  };
  const before = await Leader.findOne({ slug }).select('photo').lean();
  const doc = await Leader.findOneAndUpdate({ slug }, { $set: data }, { new: true, upsert: true, runValidators: true }).lean();
  await replaceUpload(before?.photo, doc.photo);
  return toPlain({ ...mergeLeader(slug, doc), title: defaultMessages[slug].label });
}

// ---------- Academic sessions ----------

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime());
export const weekendLabel = (days = []) => [...days].sort((a, b) => ((a + 2) % 7) - ((b + 2) % 7)).map((d) => DAY_NAMES[d]).join(' & ') || 'None';

// Shape used by the website pages
function publicSession(doc) {
  return {
    year: doc.year,
    label: doc.label || `Session ${doc.year}`,
    weekend: doc.weekend || [],
    weekendLabel: weekendLabel(doc.weekend),
    confirmed: Boolean(doc.confirmed),
    holidays: (doc.holidays || []).map((h) => ({ ...h, end: h.end || undefined })),
    events: (doc.events || []).map((e) => ({ ...e, end: e.end || undefined })),
    books: doc.books || [],
  };
}

// The built-in session in src/data/calendar.js and books.js (used until a session is saved)
function builtInSession() {
  const { session, holidays, academicEvents } = fallbackCalendar;
  return {
    year: session.year,
    label: session.label,
    weekend: session.weekend,
    confirmed: session.confirmed,
    current: true,
    holidays,
    events: academicEvents,
    books: fallbackBooks.bookLevels,
  };
}

// Session shown on the website: the one marked current, else the latest year, else the built-in one.
// cache() lets a page and its metadata share one database read.
export const currentSession = cache(async function currentSession() {
  try {
    await connectDB();
    const doc = (await AcademicSession.findOne({ current: true }).lean()) || (await AcademicSession.findOne().sort({ year: -1 }).lean());
    if (doc) return toPlain(publicSession(doc));
  } catch (error) {
    console.error('Academic session could not be loaded:', error.message);
  }
  return publicSession(builtInSession());
});

export async function listSessions() {
  await connectDB();
  const docs = await AcademicSession.find().sort({ year: -1 }).lean();
  return toPlain(
    docs.map((d) => ({
      year: d.year,
      label: d.label || `Session ${d.year}`,
      current: d.current,
      confirmed: d.confirmed,
      holidays: d.holidays.length,
      events: d.events.length,
      classes: d.books.reduce((n, l) => n + l.classes.length, 0),
      updatedAt: d.updatedAt,
    }))
  );
}

const yearOf = (value) => {
  const year = int(value, NaN);
  if (!(year >= 2000 && year <= 2100)) throw new HttpError(400, 'Choose a year between 2000 and 2100.');
  return year;
};

export async function getAcademicSession(year) {
  await connectDB();
  const doc = await AcademicSession.findOne({ year: yearOf(year) }).lean();
  if (!doc) throw new HttpError(404, 'Session not found.');
  return toPlain({ ...doc, weekendLabel: weekendLabel(doc.weekend) });
}

function cleanEntries(list, kindAllowed) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 300).map((e, i) => {
    const title = str(e?.title, 200);
    const date = str(e?.date, 10);
    const end = str(e?.end, 10);
    if (!title) throw new HttpError(400, `Row ${i + 1}: write a title.`);
    if (!isDate(date)) throw new HttpError(400, `“${title}”: choose a valid start date.`);
    if (end && !isDate(end)) throw new HttpError(400, `“${title}”: choose a valid end date.`);
    if (end && end < date) throw new HttpError(400, `“${title}”: the end date is before the start date.`);
    return {
      date,
      ...(end && end !== date && { end }),
      title,
      type: ENTRY_TYPES.includes(e.type) ? e.type : 'holiday',
      kind: kindAllowed ? str(e.kind, 40) : '',
      tentative: Boolean(e.tentative),
    };
  });
}

function cleanBooks(levels) {
  if (!Array.isArray(levels)) return [];
  return levels
    .slice(0, 30)
    .map((l) => ({
      level: str(l?.level, 120),
      classes: (Array.isArray(l?.classes) ? l.classes : []).slice(0, 40).map((c) => ({
        name: str(c?.name, 120),
        books: (Array.isArray(c?.books) ? c.books : [])
          .slice(0, 80)
          .map((b) => ({ title: str(b?.title, 200), source: BOOK_SOURCES.includes(b?.source) ? b.source : 'NCTB' }))
          .filter((b) => b.title),
      })),
    }))
    .filter((l) => l.level || l.classes.length)
    .map((l, i) => {
      if (!l.level) throw new HttpError(400, `Book list: group ${i + 1} needs a name (e.g. Primary).`);
      l.classes.forEach((c) => {
        if (!c.name) throw new HttpError(400, `Book list “${l.level}”: every class needs a name.`);
      });
      return l;
    });
}

export async function updateAcademicSession(year, input = {}) {
  await connectDB();
  const doc = await AcademicSession.findOne({ year: yearOf(year) });
  if (!doc) throw new HttpError(404, 'Session not found.');
  if ('label' in input) doc.label = str(input.label, 60);
  if ('weekend' in input) doc.weekend = [...new Set((Array.isArray(input.weekend) ? input.weekend : []).map(Number).filter((d) => d >= 0 && d <= 6))];
  if ('confirmed' in input) doc.confirmed = Boolean(input.confirmed);
  if ('holidays' in input) doc.holidays = cleanEntries(input.holidays, true);
  if ('events' in input) doc.events = cleanEntries(input.events, false);
  if ('books' in input) doc.books = cleanBooks(input.books);
  await doc.save();
  return getAcademicSession(doc.year);
}

// Same month and day in another year (29 Feb → 28 Feb)
const shiftDate = (value, years) => {
  if (!value) return value;
  const [y, m, d] = value.split('-').map(Number);
  const day = Math.min(d, new Date(Date.UTC(y + years, m, 0)).getUTCDate());
  return `${y + years}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// New session — empty, or copied from another year with every date moved to the new year
export async function createAcademicSession({ year, copyFrom } = {}) {
  await connectDB();
  const target = yearOf(year);
  if (await AcademicSession.exists({ year: target })) throw new HttpError(409, `Session ${target} already exists.`);
  let source = null;
  if (copyFrom) {
    source = await AcademicSession.findOne({ year: yearOf(copyFrom) }).lean();
    if (!source) throw new HttpError(404, `Session ${copyFrom} not found.`);
  }
  const years = source ? target - source.year : 0;
  const move = (list) => list.map((e) => ({ ...e, date: shiftDate(e.date, years), ...(e.end && { end: shiftDate(e.end, years) }) }));
  const isFirst = !(await AcademicSession.exists({}));
  const doc = await AcademicSession.create({
    year: target,
    label: `Session ${target}`,
    weekend: source?.weekend ?? [5, 6],
    confirmed: false,
    current: isFirst,
    holidays: source ? move(source.holidays) : [],
    events: source ? move(source.events) : [],
    books: source?.books ?? [],
  });
  return toPlain({ year: doc.year, title: doc.label });
}

export async function setCurrentSession(year) {
  await connectDB();
  const target = yearOf(year);
  if (!(await AcademicSession.exists({ year: target }))) throw new HttpError(404, 'Session not found.');
  await AcademicSession.updateMany({ year: { $ne: target } }, { $set: { current: false } });
  await AcademicSession.updateOne({ year: target }, { $set: { current: true } });
  return { year: target, title: `Session ${target}` };
}

export async function removeAcademicSession(year) {
  await connectDB();
  const doc = await AcademicSession.findOne({ year: yearOf(year) }).lean();
  if (!doc) throw new HttpError(404, 'Session not found.');
  if (doc.current) throw new HttpError(400, 'This session is shown on the website. Make another session current first.');
  await AcademicSession.deleteOne({ _id: doc._id });
  return { year: doc.year, title: doc.label || `Session ${doc.year}` };
}

// Built-in session data (seed script)
export const builtInSessionData = builtInSession;
