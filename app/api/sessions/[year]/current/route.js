import { route, ok } from '@/server/http';
import * as content from '@/server/services/content.service';

export const dynamic = 'force-dynamic';

// POST (admins) — show this session on the website
export const POST = route(async ({ params }) => ok(await content.setCurrentSession(params.year), 'This session is now shown on the website.'), { roles: ['admin'] });
