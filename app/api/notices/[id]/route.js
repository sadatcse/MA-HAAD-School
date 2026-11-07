import { route } from '@/server/http';
import * as notices from '@/server/controllers/notice.controller';

export const dynamic = 'force-dynamic';

export const GET = route(notices.show);
export const PUT = route(notices.update, { roles: ['admin'] });
export const DELETE = route(notices.remove, { roles: ['admin'] });
