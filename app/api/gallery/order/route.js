import { route, ok, readJson } from '@/server/http';
import * as content from '@/server/services/content.service';

export const dynamic = 'force-dynamic';

// PUT /api/gallery/order (admins) — { ids: [first, second, …] }
export const PUT = route(async ({ req }) => ok(await content.orderGallery((await readJson(req)).ids), 'Order saved.'), { roles: ['admin'] });
