import { route, ok, created, readJson } from '@/server/http';
import * as content from '@/server/services/content.service';

export const dynamic = 'force-dynamic';

// GET /api/gallery — all photos · POST (admins) — add a photo { src, title, category, width, height }
export const GET = route(async () => ok(await content.listGallery()));
export const POST = route(async ({ req }) => created(await content.createPhoto(await readJson(req)), 'Photo added.'), { roles: ['admin'] });
