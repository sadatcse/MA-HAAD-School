import { route, ok } from '@/server/http';
import * as content from '@/server/services/content.service';

export const dynamic = 'force-dynamic';

// GET /api/leaders — { 'ceo-message': {…}, 'principal-message': {…} }
export const GET = route(async () => ok(await content.listLeaders()));
