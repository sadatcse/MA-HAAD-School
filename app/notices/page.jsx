import Link from 'next/link';
import { FaSearch, FaPaperclip, FaChevronLeft, FaChevronRight, FaBullhorn, FaEye } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { images } from '@/data/school';
import { listPublished } from '@/server/services/notice.service';
import { NOTICE_CATEGORY_OPTIONS, isNew } from '@/lib/notices';
import { cn, formatDate } from '@/lib/utils';
import PageBanner from '@/components/school/PageBanner';
import Container from '@/components/ui/Container';
import { CategoryBadge, DateBlock, NoticeImage } from '@/components/school/NoticeCard';

export const metadata = {
  title: 'Notice Board',
  description: `Notices and announcements from ${siteConfig.name}.`,
};

const PAGE_SIZE = 12;

async function read(filters) {
  try {
    return { ...(await listPublished({ ...filters, limit: PAGE_SIZE })), failed: false };
  } catch {
    return { items: [], total: 0, page: 1, pages: 1, failed: true };
  }
}

function pageHref(params, page) {
  const q = new URLSearchParams(Object.entries({ ...params, page: page > 1 ? String(page) : '' }).filter(([, v]) => v));
  const s = q.toString();
  return s ? `/notices?${s}` : '/notices';
}

export default async function NoticesPage({ searchParams }) {
  const sp = await searchParams;
  const filters = {
    search: typeof sp.search === 'string' ? sp.search.slice(0, 100) : '',
    category: typeof sp.category === 'string' ? sp.category : '',
  };
  const { items, total, page, pages, failed } = await read({ ...filters, page: Number(sp.page) || 1 });
  const offset = (page - 1) * PAGE_SIZE;

  return (
    <>
      <PageBanner title="Notices & Announcements" subtitle="Important updates and circulars from the school administration." breadcrumbs={[{ label: 'Notice Board' }]} image={images.openingCeremony} />

      <section className="py-12 md:py-16">
        <Container className="max-w-6xl">
          <form action="/notices" className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_200px_auto]">
            <label className="relative">
              <span className="sr-only">Search notices</span>
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                name="search"
                defaultValue={filters.search}
                placeholder="Search notices…"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
              />
            </label>
            <label>
              <span className="sr-only">Category</span>
              <select
                name="category"
                defaultValue={filters.category}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">All categories</option>
                {NOTICE_CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <button type="submit" className="h-11 rounded-xl bg-navy-900 px-6 text-sm font-semibold text-white hover:bg-navy-800">Search</button>
          </form>

          {items.length === 0 ? (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <FaBullhorn className="text-4xl text-gold-500" aria-hidden />
              <p className="mt-4 font-display text-xl text-navy-900">
                {failed ? 'Notices could not be loaded right now' : filters.search || filters.category ? 'No notices match your search' : 'No notices have been published yet'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {failed ? 'Please try again in a little while.' : `For information, call ${siteConfig.contact.phones.join(' / ')}.`}
              </p>
              {(filters.search || filters.category) && (
                <Link href="/notices" className="mt-5 rounded-full border border-brand-300 bg-white px-5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">Show all notices</Link>
              )}
            </div>
          ) : (
            <>
              <p className="mt-6 text-sm text-slate-500">{total} notice{total === 1 ? '' : 's'}</p>

              {/* Phones: cards */}
              <ul className="mt-3 space-y-3 md:hidden">
                {items.map((n) => (
                  <li key={n._id}>
                    <Link href={`/notices/${n._id}`} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      {n.image ? (
                        <NoticeImage src={n.image} className="h-16 w-20 shrink-0 rounded-xl" sizes="80px" />
                      ) : (
                        <DateBlock date={n.date} className="w-14" />
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <CategoryBadge category={n.category} />
                          {isNew(n.date) && <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">New</span>}
                        </div>
                        <p className="mt-1.5 line-clamp-2 font-semibold leading-snug text-navy-900">{n.title}</p>
                        {n.image && <p className="mt-1 text-xs text-slate-500">{formatDate(n.date)}</p>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Tablets & desktops: table */}
              <div className="mt-3 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th scope="col" className="w-14 px-5 py-3 font-semibold">#</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Notice title</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                      <th scope="col" className="whitespace-nowrap px-5 py-3 font-semibold">Date</th>
                      <th scope="col" className="px-5 py-3 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((n, i) => (
                      <tr key={n._id} className="hover:bg-brand-50/40">
                        <td className="px-5 py-4">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">{offset + i + 1}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {n.image && <NoticeImage src={n.image} className="h-11 w-16 shrink-0 rounded-lg" sizes="64px" />}
                            <div>
                          <Link href={`/notices/${n._id}`} className="font-medium text-navy-900 hover:text-brand-700">
                            {n.title}
                          </Link>
                          {isNew(n.date) && <span className="ml-2 rounded bg-red-600 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase text-white">New</span>}
                          {n.attachmentUrl && <FaPaperclip className="ml-2 inline text-slate-400" aria-label="Has attachment" />}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4"><CategoryBadge category={n.category} /></td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(n.date)}</td>
                        <td className="px-5 py-4 text-right">
                          <Link href={`/notices/${n._id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-gold-100 px-3 py-1.5 text-xs font-semibold text-gold-700 hover:bg-gold-200">
                            <FaEye aria-hidden /> View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pages > 1 && (
                <nav aria-label="Pages" className="mt-8 flex items-center justify-center gap-2">
                  <Link
                    href={pageHref(filters, page - 1)}
                    aria-disabled={page <= 1}
                    className={cn('flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600', page <= 1 && 'pointer-events-none opacity-40')}
                    aria-label="Previous page"
                  >
                    <FaChevronLeft aria-hidden />
                  </Link>
                  {Array.from({ length: pages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
                    .map((p, i, arr) => (
                      <span key={p} className="flex items-center gap-2">
                        {i > 0 && p - arr[i - 1] > 1 && <span className="text-slate-400">…</span>}
                        <Link
                          href={pageHref(filters, p)}
                          aria-current={p === page ? 'page' : undefined}
                          className={cn('flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold', p === page ? 'bg-navy-900 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300')}
                        >
                          {p}
                        </Link>
                      </span>
                    ))}
                  <Link
                    href={pageHref(filters, page + 1)}
                    aria-disabled={page >= pages}
                    className={cn('flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600', page >= pages && 'pointer-events-none opacity-40')}
                    aria-label="Next page"
                  >
                    <FaChevronRight aria-hidden />
                  </Link>
                </nav>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
