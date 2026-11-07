import Link from 'next/link';
import { FaArrowRight, FaBook, FaCalendarAlt, FaUmbrellaBeach } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SectionHeading from '@/components/school/SectionHeading';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Campus',
  description: `Book lists, holidays and the academic calendar of ${siteConfig.name}.`,
};

const CARDS = [
  { href: '/campus/books', title: 'Books', text: 'Class-wise list of textbooks and school-selected books.', icon: FaBook },
  { href: '/campus/holidays', title: 'List of Holidays', text: 'National, religious and school holidays of the session.', icon: FaUmbrellaBeach },
  { href: '/campus/academic-calendar', title: 'Academic Calendar', text: 'Examinations, events, meetings and vacations, month by month.', icon: FaCalendarAlt },
];

export default function CampusPage() {
  return (
    <>
      <PageBanner title="Campus" subtitle="Everything students and parents need to plan the school year." breadcrumbs={[{ label: 'Campus' }]} image={images.bookFestival} />
      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading kicker="Plan the year" title="Campus Information" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CARDS.map(({ href, title, text, icon: Icon }) => (
              <Link key={href} href={href} className="group rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-brand-600 text-2xl text-white shadow-lg"><Icon aria-hidden /></span>
                <h2 className="mt-5 font-display text-2xl text-navy-900 group-hover:text-brand-700">{title}</h2>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600">Open <FaArrowRight aria-hidden /></span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
