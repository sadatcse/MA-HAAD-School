import Link from 'next/link';
import { FaChevronRight, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import { siteConfig, telHref } from '@/config/site';
import { cn } from '@/lib/utils';
import Container from '@/components/ui/Container';

// Help card: office phone, email and calling time
export function HelpCard({ className }) {
  const { contact } = siteConfig;
  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-navy-900 p-6 text-white', className)}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/30 blur-2xl" aria-hidden />
      <p className="font-display text-xl">Need help?</p>
      <p className="mt-1 text-sm text-white/70">Our office is happy to answer your questions.</p>
      <div className="mt-5 space-y-3 text-sm">
        {contact.phones.map((phone) => (
          <a key={phone} href={telHref(phone)} className="flex items-center gap-3 font-semibold hover:text-gold-300">
            <FaPhoneAlt className="text-gold-400" aria-hidden /> {phone}
          </a>
        ))}
        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 break-all hover:text-gold-300">
          <FaEnvelope className="shrink-0 text-gold-400" aria-hidden /> {contact.email}
        </a>
        <p className="flex items-center gap-3 text-white/80">
          <FaClock className="text-gold-400" aria-hidden /> {contact.callingTime}
        </p>
      </div>
    </div>
  );
}

// Inner page with a sidebar of sibling pages (About, Facilities, Admission, Campus, Administration)
export default function SubpageLayout({ title, links = [], current, children, aside }) {
  return (
    <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-14">
      <div className="min-w-0">{children}</div>

      <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
        {links.length > 0 && (
          <nav aria-label={title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <p className="bg-gradient-to-r from-brand-700 to-brand-600 px-5 py-3.5 font-display text-lg text-white">{title}</p>
            <ul className="divide-y divide-slate-100">
              {links.map((link) => {
                const active = link.href === current;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group flex items-center justify-between gap-3 px-5 py-3 text-sm transition-colors',
                        active ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700'
                      )}
                    >
                      {link.label}
                      <FaChevronRight className={cn('shrink-0 text-[10px] transition-transform group-hover:translate-x-0.5', active ? 'text-gold-500' : 'text-slate-300')} aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
        {aside}
        <HelpCard />
      </aside>
    </Container>
  );
}
