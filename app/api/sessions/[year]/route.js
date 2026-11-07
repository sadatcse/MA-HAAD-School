import { route, ok, readJson } from '@/server/http';
import * as content from '@/server/services/content.service';

export const dynamic = 'force-dynamic';

export const GET = route(async ({ params }) => ok(await content.getAcademicSession(params.year)), { roles: ['admin'] });
export const PUT = route(async ({ req, params }) => ok(await content.updateAcademicSession(params.year, await readJson(req)), 'Session saved.'), { roles: ['admin'] });
export const DELETE = route(async ({ params }) => ok(await content.removeAcademicSession(params.year), 'Session deleted.'), { roles: ['admin'] });
