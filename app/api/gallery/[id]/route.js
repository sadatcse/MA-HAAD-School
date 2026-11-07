import { route, ok, readJson } from '@/server/http';
import * as content from '@/server/services/content.service';

export const dynamic = 'force-dynamic';

export const PUT = route(async ({ req, params }) => ok(await content.updatePhoto(params.id, await readJson(req)), 'Photo saved.'), { roles: ['admin'] });
export const DELETE = route(async ({ params }) => ok(await content.removePhoto(params.id), 'Photo deleted.'), { roles: ['admin'] });
