import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import { images } from '@/data/school';
import Container from '@/components/ui/Container';

// Inner-page banner: school photo under a navy overlay, title and breadcrumb.
// breadcrumbs: [{ label, href? }] — "Home" is added automatically.
export default function PageBanner({ title, subtitle, breadcrumbs = [], image = images.marchPast }) {
  const crumbs = [{ label: 'Home', href: '/' }, ...breadcrumbs];
  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <Image src={image} alt="" fill sizes="100vw" className="-z-20 object-cover object-center opacity-40" preload />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-900/85 to-brand-800/60" aria-hidden />
      <Container className="py-12 md:py-16 lg:py-20">
        <h1 className="max-w-3xl text-balance font-display text-3xl text-white md:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">{subtitle}</p>}
        <nav aria-label="Breadcrumb" className="mt-5">
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              return (
                <Fragment key={`${crumb.label}-${i}`}>
                  {i > 0 && <FaChevronRight className="text-[9px] text-white/50" aria-hidden />}
                  <li>
                    {crumb.href && !last ? (
                      <Link href={crumb.href} className="inline-flex items-center gap-1.5 text-gold-300 hover:text-gold-200">
                        {i === 0 && <FaHome aria-hidden />} {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-white" aria-current={last ? 'page' : undefined}>{crumb.label}</span>
                    )}
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </nav>
      </Container>
      <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500" aria-hidden />
    </section>
  );
}
