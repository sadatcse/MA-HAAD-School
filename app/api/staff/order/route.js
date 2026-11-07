import { route, ok, readJson } from '@/server/http';
import * as content from '@/server/services/content.service';

export const dynamic = 'force-dynamic';

// PUT /api/staff/order (admins) — { group, ids: [first, second, …] }
export const PUT = route(
  async ({ req }) => {
    const { group, ids } = await readJson(req);
    return ok(await content.orderStaff(group, ids), 'Order saved.');
  },
  { roles: ['admin'] }
);
