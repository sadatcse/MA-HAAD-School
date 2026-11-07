import { route, ok, readJson } from '@/server/http';
import * as content from '@/server/services/content.service';

export const dynamic = 'force-dynamic';

export const PUT = route(async ({ req, params }) => ok(await content.updateMember(params.id, await readJson(req)), 'Saved.'), { roles: ['admin'] });
export const DELETE = route(async ({ params }) => ok(await content.removeMember(params.id), 'Removed.'), { roles: ['admin'] });
