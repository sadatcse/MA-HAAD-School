import { route, created, HttpError } from '@/server/http';
import { saveImage } from '@/server/storage';

export const dynamic = 'force-dynamic';

// POST /api/uploads (admins) — multipart form with `file` and `folder` → { url, width, height }
export const POST = route(
  async ({ req }) => {
    let form;
    try {
      form = await req.formData();
    } catch {
      throw new HttpError(400, 'Send the image as a file upload.');
    }
    const image = await saveImage(form.get('file'), String(form.get('folder') || 'misc'));
    return created(image, 'Image uploaded.');
  },
  { roles: ['admin'] }
);
