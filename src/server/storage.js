// Uploaded images (gallery, staff photos, notice images …).
// Files are saved under UPLOAD_DIR (default: <project>/uploads) and served by app/uploads/[...path]/route.js
// at /uploads/<folder>/<file>. They are NOT put in /public, because a built Next.js site (e.g. on cPanel)
// only serves the public files that existed at build time.
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { HttpError } from '@/server/http';

export const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));
export const UPLOAD_URL = '/uploads';
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

// Folders an upload may go into, with the longest side the image is shrunk to
export const UPLOAD_FOLDERS = { gallery: 2000, staff: 800, leaders: 900, notices: 1600, misc: 1600 };

const TYPES = {
  'image/jpeg': { ext: 'jpg', magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { ext: 'png', magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  'image/webp': { ext: 'webp', magic: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
  'image/gif': { ext: 'gif', magic: (b) => b.subarray(0, 4).toString() === 'GIF8' },
};

// sharp ships with Next.js. If it can't load on the server, images are saved as uploaded.
let sharpPromise;
const loadSharp = () => {
  sharpPromise ??= import('sharp').then((m) => m.default).catch(() => null);
  return sharpPromise;
};

/**
 * Saves an uploaded image File and returns { url, width, height }.
 * Photos are resized (longest side) and converted to WebP when sharp is available.
 */
export async function saveImage(file, folder = 'misc') {
  if (!file || typeof file.arrayBuffer !== 'function') throw new HttpError(400, 'Choose an image to upload.');
  if (!UPLOAD_FOLDERS[folder]) throw new HttpError(400, 'Unknown upload folder.');
  if (file.size > MAX_UPLOAD_BYTES) throw new HttpError(413, 'The image is too large — the limit is 8 MB.');

  const input = Buffer.from(await file.arrayBuffer());
  const type = Object.entries(TYPES).find(([, t]) => t.magic(input));
  if (!type) throw new HttpError(415, 'Only JPG, PNG, WebP or GIF images can be uploaded.');

  let output = input;
  let ext = type[1].ext;
  let width = 0;
  let height = 0;

  const sharp = await loadSharp();
  if (sharp && ext !== 'gif') {
    try {
      const max = UPLOAD_FOLDERS[folder];
      const { data, info } = await sharp(input, { failOn: 'error' })
        .rotate() // respect phone camera orientation
        .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });
      output = data;
      ext = 'webp';
      ({ width, height } = info);
    } catch {
      throw new HttpError(415, 'This image could not be read. Please try another file.');
    }
  } else if (sharp) {
    const meta = await sharp(input).metadata().catch(() => ({}));
    width = meta.width || 0;
    height = meta.height || 0;
  }

  const name = `${Date.now().toString(36)}-${randomBytes(6).toString('hex')}.${ext}`;
  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), output);
  return { url: `${UPLOAD_URL}/${folder}/${name}`, width, height };
}

// Absolute file path for a /uploads/… URL, or null if the URL is not an upload (or tries to escape the folder)
export function uploadPath(url) {
  if (typeof url !== 'string' || !url.startsWith(`${UPLOAD_URL}/`)) return null;
  const file = path.resolve(UPLOAD_ROOT, decodeURIComponent(url.slice(UPLOAD_URL.length + 1)));
  return file.startsWith(UPLOAD_ROOT + path.sep) ? file : null;
}

// Deletes an uploaded file. Site images (/images/…) and outside links are left alone.
export async function deleteUpload(url) {
  const file = uploadPath(url);
  if (file) await unlink(file).catch(() => {});
}

// When a record's image changes, delete the old upload
export async function replaceUpload(oldUrl, newUrl) {
  if (oldUrl && oldUrl !== newUrl) await deleteUpload(oldUrl);
}
