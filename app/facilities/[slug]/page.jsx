import Image from 'next/image';
import { notFound } from 'next/navigation';
import { sectionLinks } from '@/config/navigation';
import { facilities } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SubpageLayout from '@/components/school/SubpageLayout';
import { Kicker } from '@/components/school/SectionHeading';
import { CheckList } from '@/components/school/Blocks';

const find = (slug) => facilities.find((f) => f.slug === slug);

export function generateStaticParams() {
  return facilities.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const facility = find((await params).slug);
  return facility ? { title: facility.title, description: facility.summary } : {};
}

export default async function FacilityPage({ params }) {
  const { slug } = await params;
  const facility = find(slug);
  if (!facility) notFound();
  const Icon = facility.icon;

  return (
    <>
      <PageBanner
        title={facility.title}
        subtitle={facility.summary}
        breadcrumbs={[{ label: 'Facilities', href: '/facilities' }, { label: facility.title }]}
        {...(facility.image && { image: facility.image })}
      />

      <SubpageLayout title="Facilities" links={sectionLinks('/facilities')} current={`/facilities/${slug}`}>
        {facility.image ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-xl shadow-navy-900/10">
            <Image src={facility.image} alt={facility.title} fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
          </div>
        ) : (
          <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-brand-800 to-brand-600 shadow-xl">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" aria-hidden />
            <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-gold-400/10" aria-hidden />
            <span className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10 text-5xl text-gold-300 ring-1 ring-white/20 backdrop-blur">
              <Icon aria-hidden />
            </span>
          </div>
        )}

        <div className="mt-10">
          <Kicker>Facilities</Kicker>
          <h2 className="mt-4 font-display text-3xl text-navy-900">{facility.title}</h2>
        </div>
        <div className="prose-school mt-5">
          {facility.paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
        </div>

        <h3 className="mt-10 font-display text-2xl text-navy-900">Highlights</h3>
        <CheckList items={facility.features} className="mt-5" />
      </SubpageLayout>
    </>
  );
}
