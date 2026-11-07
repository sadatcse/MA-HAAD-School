import { apiSecure, apiError } from '@/lib/api-client';

// Uploads one image to /api/uploads → { url, width, height }
export async function uploadImage(file, folder) {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  try {
    const res = await apiSecure.post('/uploads', form);
    return res.data.data;
  } catch (err) {
    throw new Error(apiError(err, 'The image could not be uploaded.'));
  }
}

export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
