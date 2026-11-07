import Link from 'next/link';
import { FaArrowRight, FaUsers } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { staffGroups } from '@/data/staff';
import { images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SectionHeading from '@/components/school/SectionHeading';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Administration',
  description: `Board of Trustees, management and teachers of ${siteConfig.name}.`,
};

export default function AdministrationPage() {
  return (
    <>
      <PageBanner title="Administration" subtitle="The people who lead, teach and care for our students." breadcrumbs={[{ label: 'Administration' }]} image={images.sportsTeachers} />
      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading kicker="Our people" title="Leadership & Faculty" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {staffGroups.map((group) => (
              <Link key={group.slug} href={`/administration/${group.slug}`} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-100 text-2xl text-gold-600 transition group-hover:bg-gold-400 group-hover:text-navy-950">
                  <FaUsers aria-hidden />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-brand-600">{group.kicker}</p>
                <h2 className="mt-1 font-display text-2xl text-navy-900 group-hover:text-brand-700">{group.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{group.intro}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600">View <FaArrowRight aria-hidden /></span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
