import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { uploadPath } from '@/server/storage';

export const dynamic = 'force-dynamic';

const TYPES = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif' };

// Serves uploaded images from UPLOAD_DIR. File names are random and never reused, so they can be cached for a year.
export async function GET(req, { params }) {
  const parts = (await params).path || [];
  const file = uploadPath(`/uploads/${parts.map(encodeURIComponent).join('/')}`);
  const type = file && TYPES[path.extname(file).toLowerCase()];
  if (!type) return new Response('Not found', { status: 404 });

  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    const body = await readFile(file);
    return new Response(body, {
      headers: {
        'Content-Type': type,
        'Content-Length': String(info.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
