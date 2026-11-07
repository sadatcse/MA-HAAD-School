import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { facilities, images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SectionHeading from '@/components/school/SectionHeading';
import Container from '@/components/ui/Container';
import { AdmissionCta } from '@/components/school/Blocks';

export const metadata = {
  title: 'Facilities',
  description: `Library, laboratory, medical care, digital classrooms, computer lab and debate club at ${siteConfig.name}.`,
};

export default function FacilitiesPage() {
  return (
    <>
      <PageBanner title="Facilities" subtitle="Well-equipped spaces and caring support for every learner." breadcrumbs={[{ label: 'Facilities' }]} image={images.scienceLab} />
      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading kicker="On campus" title="Our Facilities" subtitle="Everything our students need to learn, explore and grow — safely and happily." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map(({ slug, title, summary, image, icon: Icon }) => (
              <Link key={slug} href={`/facilities/${slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                  {image && <Image src={image} alt="" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" aria-hidden />
                </div>
                <div className="relative flex flex-1 flex-col px-7 pb-7">
                  <span className="-mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-brand-600 text-2xl text-white shadow-lg ring-4 ring-white">
                    <Icon aria-hidden />
                  </span>
                  <h2 className="mt-4 font-display text-2xl text-navy-900 group-hover:text-brand-700">{title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600">
                    Learn more <FaArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <AdmissionCta />
    </>
  );
}
