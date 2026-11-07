import Link from 'next/link';
import { FaBullhorn } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { dateParts } from '@/lib/utils';
import { isNew } from '@/lib/notices';

// Shown when there are no notices yet (or the database is unreachable)
const FALLBACK = [
  { title: `Welcome to ${siteConfig.name} — ${siteConfig.tagline}`, href: '/about' },
  { title: `For admission enquiries call ${siteConfig.contact.phones.join(' / ')} (${siteConfig.contact.callingTime})`, href: '/admission/information' },
  { title: `${siteConfig.curriculum} · Play Group to Class X`, href: '/admission' },
];

function Item({ item, copy = false }) {
  const parts = item.date ? dateParts(item.date) : null;
  return (
    <Link href={item.href} tabIndex={copy ? -1 : undefined} className="group inline-flex items-center gap-2.5 whitespace-nowrap pr-10 text-sm text-navy-900">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
      {item.date && isNew(item.date) && <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-white">New</span>}
      {parts && (
        <span className="rounded bg-navy-900 px-2 py-0.5 text-[11px] font-semibold text-white">
          {parts.day} {parts.month}, {parts.year}
        </span>
      )}
      <span className="font-medium group-hover:text-brand-600 group-hover:underline">{item.title}</span>
    </Link>
  );
}

// Scrolling notice bar under the menu. Pauses on hover / keyboard focus.
export default function NoticeTicker({ notices = [] }) {
  const items = notices.length
    ? notices.map((n) => ({ title: n.title, date: n.date, href: `/notices/${n._id}` }))
    : FALLBACK;
  // Longer content scrolls for longer so the speed stays readable
  const chars = items.reduce((sum, i) => sum + i.title.length, 0);
  const duration = Math.max(25, Math.round(chars / 5));

  return (
    <div className="relative z-30 flex h-11 items-stretch border-b border-gold-200 bg-gold-50">
      <Link
        href="/notices"
        className="relative z-10 flex shrink-0 items-center gap-2 bg-gold-400 pl-4 pr-6 text-xs font-bold uppercase tracking-wider text-navy-950 [clip-path:polygon(0_0,100%_0,calc(100%-14px)_100%,0_100%)] sm:pl-6 sm:pr-8 sm:text-[13px]"
      >
        <FaBullhorn aria-hidden /> <span className="hidden sm:inline">Latest</span> Notice
      </Link>
      <div className="relative flex min-w-0 flex-1 items-center overflow-hidden">
        <div className="marquee-track flex w-max animate-marquee items-center" style={{ '--marquee-duration': `${duration}s` }}>
          {/* Two copies make the loop seamless; the second is hidden from screen readers */}
          <div className="flex items-center">
            {items.map((item, i) => <Item key={`a-${i}`} item={item} />)}
          </div>
          <div className="flex items-center" aria-hidden="true">
            {items.map((item, i) => <Item key={`b-${i}`} item={item} copy />)}
          </div>
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gold-50 to-transparent" aria-hidden />
      </div>
    </div>
  );
}
