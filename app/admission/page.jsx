import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { sectionLinks } from '@/config/navigation';
import { programs, admissionInfo, images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SectionHeading from '@/components/school/SectionHeading';
import Container from '@/components/ui/Container';
import { AdmissionCta } from '@/components/school/Blocks';

export const metadata = {
  title: 'Admission',
  description: `Admission to ${siteConfig.name} — Play Group to Class X, English Version, National Curriculum.`,
};

export default function AdmissionPage() {
  const more = sectionLinks('/admission').filter((l) => !programs.some((p) => l.href === `/admission/${p.slug}`));
  return (
    <>
      <PageBanner title="Admission" subtitle={admissionInfo.intro} breadcrumbs={[{ label: 'Admission' }]} image={images.newYear} />

      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading kicker="Choose a level" title="Classes We Offer" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {programs.map((p) => (
              <Link key={p.slug} href={`/admission/${p.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[16/10]">
                  <Image src={p.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-950">{p.level}</span>
                </div>
                <div className="p-6">
                  <h2 className="font-display text-2xl text-navy-900 group-hover:text-brand-700">{p.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600">
                    Details <FaArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {more.map((link) => (
              <Link key={link.href} href={link.href} className="group flex items-center justify-between rounded-2xl bg-navy-900 px-6 py-5 font-display text-lg text-white transition hover:bg-brand-700">
                {link.label}
                <FaArrowRight className="text-gold-400 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <AdmissionCta />
    </>
  );
}
