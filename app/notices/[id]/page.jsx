import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaCalendarAlt, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { images } from '@/data/school';
import { getPublished, latest } from '@/server/services/notice.service';
import { formatDate } from '@/lib/utils';
import PageBanner from '@/components/school/PageBanner';
import Container from '@/components/ui/Container';
import { CategoryBadge, DateBlock, NoticeImage } from '@/components/school/NoticeCard';
import { HelpCard } from '@/components/school/SubpageLayout';
import PrintButton from '@/components/school/PrintButton';

async function readNotice(id) {
  try {
    return await getPublished(id);
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const notice = await readNotice(id).catch(() => null);
  if (!notice) return { title: 'Notice' };
  return { title: notice.title, description: notice.summary || `Notice from ${siteConfig.name}` };
}

export default async function NoticeDetailPage({ params }) {
  const { id } = await params;
  const notice = await readNotice(id);
  if (!notice) notFound();
  const others = (await latest(6).catch(() => [])).filter((n) => n._id !== notice._id).slice(0, 5);
  const paragraphs = (notice.body || notice.summary || '').split(/\n{2,}/).filter(Boolean);
  const isPdf = /\.pdf($|\?)/i.test(notice.attachmentUrl);

  return (
    <>
      <PageBanner title="Notice Details" breadcrumbs={[{ label: 'Notice Board', href: '/notices' }, { label: 'Details' }]} image={images.openingCeremony} />

      <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-start gap-5">
            <DateBlock date={notice.date} />
            <div className="min-w-0">
              <CategoryBadge category={notice.category} />
              <h2 className="mt-3 font-display text-2xl leading-snug text-navy-900 sm:text-3xl">{notice.title}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <FaCalendarAlt className="text-gold-500" aria-hidden /> {formatDate(notice.date)}
              </p>
            </div>
          </div>

          {notice.image && (
            <NoticeImage src={notice.image} alt={notice.title} className="mt-8 aspect-[16/9] rounded-2xl" sizes="(min-width: 1024px) 760px, 100vw" preload />
          )}

          <div className={notice.image ? 'prose-school mt-8' : 'prose-school mt-8 border-t border-slate-100 pt-8'}>
            {paragraphs.length ? (
              paragraphs.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)
            ) : (
              <p className="text-slate-500">Please see the attached file for details.</p>
            )}
          </div>

          {notice.attachmentUrl && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-50 p-5">
              <p className="text-sm font-semibold text-navy-900">Attachment</p>
              <a
                href={notice.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
              >
                {isPdf ? <FaDownload aria-hidden /> : <FaExternalLinkAlt aria-hidden />} {isPdf ? 'Open PDF' : 'Open attachment'}
              </a>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
            <Link href="/notices" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-gold-600">
              <FaArrowLeft aria-hidden /> All notices
            </Link>
            <PrintButton label="Print notice" />
          </div>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          {others.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <p className="bg-gradient-to-r from-brand-700 to-brand-600 px-5 py-3.5 font-display text-lg text-white">Recent notices</p>
              <ul className="divide-y divide-slate-100">
                {others.map((n) => (
                  <li key={n._id}>
                    <Link href={`/notices/${n._id}`} className="flex gap-3 px-5 py-3.5 hover:bg-slate-50">
                      {n.image && <NoticeImage src={n.image} className="h-12 w-16 shrink-0 rounded-lg" sizes="64px" />}
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-sm font-medium text-navy-900">{n.title}</span>
                        <span className="mt-1 block text-xs text-slate-500">{formatDate(n.date)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <HelpCard />
        </aside>
      </Container>
    </>
  );
}
