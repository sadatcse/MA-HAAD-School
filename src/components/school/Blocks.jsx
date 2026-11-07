import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaPhoneAlt, FaUserTie } from 'react-icons/fa';
import { siteConfig, telHref } from '@/config/site';
import { images } from '@/data/school';
import { cn } from '@/lib/utils';
import Container from '@/components/ui/Container';
import SectionHeading from './SectionHeading';

// Rounded pill link/button in the school style
export function PillButton({ href, children, variant = 'navy', className, ...props }) {
  const styles = {
    navy: 'bg-gradient-to-r from-navy-900 to-brand-700 text-white shadow-lg shadow-navy-900/20 hover:brightness-110',
    gold: 'bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 shadow-lg shadow-gold-500/25 hover:brightness-105',
    outline: 'border border-brand-300 bg-white text-brand-700 hover:bg-brand-50',
    light: 'border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20',
  };
  const classes = cn('inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition', styles[variant], className);
  if (href?.startsWith('http') || href?.startsWith('tel:') || href?.startsWith('mailto:')) {
    return <a href={href} className={classes} {...props}>{children}</a>;
  }
  return <Link href={href} className={classes} {...props}>{children}</Link>;
}

// Person photo, or a neutral placeholder until a photo is added
export function PersonPhoto({ photo, name, className, sizes = '300px' }) {
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100', className)}>
      {photo ? (
        <Image src={photo} alt={name || ''} fill sizes={sizes} className="object-cover object-top" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center text-brand-300">
          <FaUserTie className="h-2/5 w-2/5" aria-hidden />
        </div>
      )}
    </div>
  );
}

// Section shown while a list (teachers, trustees) is still being prepared
export function ComingSoon({ title, text }) {
  const { contact } = siteConfig;
  return (
    <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 px-6 py-12 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-brand-600 shadow-sm">
        <FaUserTie aria-hidden />
      </span>
      <h2 className="mt-5 font-display text-2xl text-navy-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">{text}</p>
      <a href={telHref(contact.phones[0])} className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
        <FaPhoneAlt aria-hidden /> {contact.phones[0]}
      </a>
    </div>
  );
}

// Admission call-to-action band (end of most pages)
export function AdmissionCta() {
  const { contact } = siteConfig;
  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <Image src={images.sportsTeam} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-900/95 to-brand-800/80" aria-hidden />
      <Container className="flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
        <div>
          <span className="inline-flex rounded-full bg-gold-400 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-navy-950">Admission enquiries</span>
          <h2 className="mt-4 font-display text-3xl text-white md:text-4xl">Ready to join the MA HAAD family?</h2>
          <p className="mt-2 max-w-xl text-white/75">Play Group to Class IX · English Version · National Curriculum. Call {contact.phones[0]} ({contact.callingTime}).</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <PillButton href="/admission/information" variant="gold">
            Admission Information <FaArrowRight aria-hidden />
          </PillButton>
          <PillButton href="/contact" variant="light">Contact Us</PillButton>
        </div>
      </Container>
    </section>
  );
}

// Google map of the campus
export function CampusMap({ className, title = true }) {
  const { contact } = siteConfig;
  return (
    <section className={cn('bg-slate-50', className)}>
      {title && (
        <Container className="pb-10 pt-16">
          <SectionHeading kicker="Find us" title="Visit Our Campus" subtitle={contact.address} />
        </Container>
      )}
      <iframe
        title={`Map — ${siteConfig.name}`}
        src={contact.mapEmbed}
        className="block h-[360px] w-full border-0 md:h-[420px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}

// Simple bulleted feature list in two columns
export function CheckList({ items, className }) {
  return (
    <ul className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white" aria-hidden>✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
