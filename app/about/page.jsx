import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { sectionLinks } from '@/config/navigation';
import { welcome, purpose, highlights, approach, images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SubpageLayout from '@/components/school/SubpageLayout';
import SectionHeading, { Kicker } from '@/components/school/SectionHeading';
import Container from '@/components/ui/Container';
import { AdmissionCta } from '@/components/school/Blocks';

export const metadata = {
  title: 'About MA HAAD School and College',
  description: `Who we are — the story, mission and values of ${siteConfig.name}, an English Version school in Khilkhet, Dhaka.`,
};

export default function AboutPage() {
  const [first, ...rest] = welcome.paragraphs;
  return (
    <>
      <PageBanner title="About MA HAAD School and College" subtitle={welcome.tagline} breadcrumbs={[{ label: 'About Us' }]} />

      <SubpageLayout title="About Us" links={sectionLinks('/about')} current="/about">
        <Kicker>Our story</Kicker>
        <h2 className="mt-4 font-display text-3xl leading-tight text-navy-900 md:text-4xl">{welcome.title}</h2>
        <p className="mt-2 font-display text-lg italic text-gold-600">{welcome.tagline}</p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl shadow-xl shadow-navy-900/10">
          <Image src={images.sportsTeam} alt="Teachers, guests and students of MA HAAD at the Annual Sports" fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" preload />
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {highlights.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-navy-900">
              <Icon className="text-brand-600" aria-hidden /> {label}
            </li>
          ))}
        </ul>

        <div className="prose-school mt-8">
          <p className="text-lg font-medium leading-relaxed text-navy-900">{first}</p>
          {rest.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
          <p className="rounded-2xl border-l-4 border-gold-400 bg-gold-50 px-5 py-4 font-display text-xl italic text-navy-900">{welcome.closing}</p>
        </div>
      </SubpageLayout>

      <section className="bg-slate-50 py-16 md:py-20">
        <Container>
          <SectionHeading kicker="Our purpose" title="Mission, Vision & Values" subtitle="The guiding principles that shape every decision we make and every student we educate." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {purpose.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-navy-900 to-brand-600 text-2xl text-white shadow-lg">
                  <Icon aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-2xl text-navy-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading kicker="What makes us different" title="Our Educational Approach" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {approach.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-lg text-gold-600"><Icon aria-hidden /></span>
                <div>
                  <h3 className="font-display text-lg text-navy-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <AdmissionCta />
    </>
  );
}
