import { route, ok, created, readJson } from '@/server/http';
import * as content from '@/server/services/content.service';

export const dynamic = 'force-dynamic';

// GET /api/staff?group=primary-teachers · POST (admins) — add a person
export const GET = route(async ({ query }) => ok(await content.listStaff(query.get('group') || '')));
export const POST = route(async ({ req }) => created(await content.createMember(await readJson(req)), 'Person added.'), { roles: ['admin'] });
