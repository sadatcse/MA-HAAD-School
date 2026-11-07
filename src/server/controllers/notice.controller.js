import { created, ok, readJson } from '@/server/http';
import * as notices from '@/server/services/notice.service';

// GET /api/notices — public list (?page, ?category, ?search). Admins add ?all=1 to include drafts.
export async function list({ query, session }) {
  const filters = { search: query.get('search') || '', category: query.get('category') || '' };
  if (query.get('all') === '1' && session?.role === 'admin') {
    return ok(await notices.listAll({ ...filters, status: query.get('status') || '' }));
  }
  return ok(await notices.listPublished({ ...filters, page: query.get('page'), limit: query.get('limit') }));
}

// GET /api/notices/:id — published notice (admins can read drafts too)
export async function show({ params, session }) {
  if (session?.role === 'admin') return ok(await notices.getOne(params.id));
  return ok(await notices.getPublished(params.id));
}

export async function create({ req, session }) {
  return created(await notices.create(await readJson(req), { userId: session._id }), 'Notice published.');
}

export async function update({ req, params }) {
  return ok(await notices.update(params.id, await readJson(req)), 'Notice saved.');
}

export async function remove({ params }) {
  return ok(await notices.remove(params.id), 'Notice deleted.');
}
