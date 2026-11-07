import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaPaperclip, FaThumbtack } from 'react-icons/fa';
import { categoryStyle, isNew } from '@/lib/notices';
import { cn, dateParts } from '@/lib/utils';

export function CategoryBadge({ category, className }) {
  const style = categoryStyle(category);
  return <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', style.className, className)}>{style.label}</span>;
}

export function DateBlock({ date, className }) {
  const { day, month, year } = dateParts(date);
  return (
    <div className={cn('flex w-16 shrink-0 flex-col items-center overflow-hidden rounded-xl bg-navy-900 text-white shadow-md', className)}>
      <span className="h-1 w-full bg-gold-400" aria-hidden />
      <span className="pt-1.5 text-2xl font-bold leading-none">{day}</span>
      <span className="mt-1 text-[11px] font-semibold uppercase">{month}</span>
      <span className="pb-2 text-[10px] text-white/60">{year}</span>
    </div>
  );
}

// Notice photo. Site images (/images/…) are optimised by Next; outside links are shown as they are.
export function NoticeImage({ src, alt = '', className, imgClassName, sizes = '400px', preload = false }) {
  return (
    <div className={cn('relative overflow-hidden bg-slate-100', className)}>
      <Image src={src} alt={alt} fill sizes={sizes} preload={preload} unoptimized={!src.startsWith('/')} className={cn('object-cover', imgClassName)} />
    </div>
  );
}

// Notice card for the home page and lists. With a photo, the date badge overlaps its bottom edge.
export default function NoticeCard({ notice }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5">
      {notice.image && (
        <NoticeImage
          src={notice.image}
          className="aspect-[16/9]"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
        />
      )}
      <div className="flex flex-1 gap-4 p-5">
        <DateBlock date={notice.date} className={cn('self-start', notice.image && 'relative z-10 -mt-12 ring-4 ring-white')} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryBadge category={notice.category} />
            {isNew(notice.date) && <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">New</span>}
            {notice.pinned && <FaThumbtack className="text-xs text-gold-600" aria-label="Pinned" />}
          </div>
          <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-navy-900">
            <Link href={`/notices/${notice._id}`} className="after:absolute after:inset-0 group-hover:text-brand-700">
              {notice.title}
            </Link>
          </h3>
          {notice.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">{notice.summary}</p>}
          <div className="mt-auto flex items-center gap-3 pt-3 text-xs font-semibold text-gold-600">
            Read More <FaArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
            {notice.attachmentUrl && <FaPaperclip className="ml-auto text-slate-400" aria-label="Has attachment" />}
          </div>
        </div>
      </div>
    </article>
  );
}
