// Notice board — public reads (website) and admin CRUD (Dashboard → Notices).
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Notice, { NOTICE_CATEGORIES, NOTICE_STATUSES } from '@/models/Notice';
import { HttpError } from '@/server/http';
import { str, toPlain } from '@/server/validate';
import { escapeRegex } from '@/lib/utils';
import { replaceUpload, deleteUpload } from '@/server/storage';

const PUBLIC_FIELDS = 'title category summary date image attachmentUrl pinned createdAt';
const PUBLISHED = { status: 'published' };
const SORT = { pinned: -1, date: -1, createdAt: -1 };

function clean(input = {}) {
  const title = str(input.title, 250);
  if (!title) throw new HttpError(400, 'Title is required.');
  const category = NOTICE_CATEGORIES.includes(input.category) ? input.category : 'general';
  const status = NOTICE_STATUSES.includes(input.status) ? input.status : 'published';
  const date = input.date ? new Date(input.date) : new Date();
  if (Number.isNaN(date.getTime())) throw new HttpError(400, 'Choose a valid date.');
  const attachmentUrl = str(input.attachmentUrl, 1000);
  if (attachmentUrl && !/^(https?:\/\/|\/)/i.test(attachmentUrl)) {
    throw new HttpError(400, 'The attachment link must start with https:// or /');
  }
  const image = str(input.image, 1000);
  if (image && !/^(https:\/\/|\/)/i.test(image)) {
    throw new HttpError(400, 'The image link must start with https:// or /');
  }
  return {
    title,
    category,
    status,
    date,
    attachmentUrl,
    image,
    summary: str(input.summary, 500),
    body: str(input.body, 20000),
    inTicker: input.inTicker !== false,
    pinned: Boolean(input.pinned),
  };
}

const validId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, 'Notice not found.');
  return id;
};

// ---------- public ----------

export async function listPublished({ page = 1, limit = 12, category, search } = {}) {
  await connectDB();
  const filter = { ...PUBLISHED };
  if (category && NOTICE_CATEGORIES.includes(category)) filter.category = category;
  if (search) {
    const re = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: re }, { summary: re }];
  }
  const size = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const current = Math.max(Number(page) || 1, 1);
  const [items, total] = await Promise.all([
    Notice.find(filter).select(PUBLIC_FIELDS).sort(SORT).skip((current - 1) * size).limit(size).lean(),
    Notice.countDocuments(filter),
  ]);
  return { items: toPlain(items), total, page: current, pages: Math.max(Math.ceil(total / size), 1) };
}

export async function getPublished(id) {
  await connectDB();
  const notice = await Notice.findOne({ _id: validId(id), ...PUBLISHED }).select('-createdBy').lean();
  if (!notice) throw new HttpError(404, 'Notice not found.');
  return toPlain(notice);
}

export async function latest(limit = 3) {
  await connectDB();
  return toPlain(await Notice.find(PUBLISHED).select(PUBLIC_FIELDS).sort(SORT).limit(limit).lean());
}

// Scrolling bar under the menu — read by every page, so cached briefly
const TICKER_MS = 60 * 1000;
let tickerCache = { value: null, expires: 0 };

export async function tickerNotices() {
  if (tickerCache.value && tickerCache.expires > Date.now()) return tickerCache.value;
  await connectDB();
  const value = toPlain(
    await Notice.find({ ...PUBLISHED, inTicker: true }).select('title date category').sort(SORT).limit(10).lean()
  );
  tickerCache = { value, expires: Date.now() + TICKER_MS };
  return value;
}

const clearTicker = () => {
  tickerCache = { value: null, expires: 0 };
};

// ---------- admin ----------

export async function listAll({ search, status, category } = {}) {
  await connectDB();
  const filter = {};
  if (status && NOTICE_STATUSES.includes(status)) filter.status = status;
  if (category && NOTICE_CATEGORIES.includes(category)) filter.category = category;
  if (search) filter.title = new RegExp(escapeRegex(search), 'i');
  return toPlain(await Notice.find(filter).sort(SORT).limit(500).lean());
}

export async function getOne(id) {
  await connectDB();
  const notice = await Notice.findById(validId(id)).lean();
  if (!notice) throw new HttpError(404, 'Notice not found.');
  return toPlain(notice);
}

export async function create(input, { userId } = {}) {
  await connectDB();
  const notice = await Notice.create({ ...clean(input), createdBy: userId });
  clearTicker();
  return toPlain(notice.toObject());
}

export async function update(id, input) {
  await connectDB();
  const before = await Notice.findById(validId(id)).select('image').lean();
  if (!before) throw new HttpError(404, 'Notice not found.');
  const notice = await Notice.findByIdAndUpdate(id, clean(input), { new: true, runValidators: true }).lean();
  if (!notice) throw new HttpError(404, 'Notice not found.');
  await replaceUpload(before.image, notice.image);
  clearTicker();
  return toPlain(notice);
}

export async function remove(id) {
  await connectDB();
  const notice = await Notice.findByIdAndDelete(validId(id)).lean();
  if (!notice) throw new HttpError(404, 'Notice not found.');
  await deleteUpload(notice.image);
  clearTicker();
  return toPlain({ _id: notice._id, title: notice.title });
}
