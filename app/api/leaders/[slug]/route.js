import { route, ok, readJson } from '@/server/http';
import * as content from '@/server/services/content.service';

export const dynamic = 'force-dynamic';

// PUT /api/leaders/ceo-message (admins) — { name, role, photo, heading, excerpt, body }
export const PUT = route(async ({ req, params }) => ok(await content.updateLeader(params.slug, await readJson(req)), 'Message saved.'), { roles: ['admin'] });
