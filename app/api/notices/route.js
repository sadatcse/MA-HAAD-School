import { route } from '@/server/http';
import * as notices from '@/server/controllers/notice.controller';

export const dynamic = 'force-dynamic';

export const GET = route(notices.list);
export const POST = route(notices.create, { roles: ['admin'] });
