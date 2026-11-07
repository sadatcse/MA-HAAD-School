import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaBullhorn } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { heroSlides, welcome, highlights, programs, facilities, values, approach, quickLinks, images } from '@/data/school';
import { listGallery } from '@/server/services/content.service';
import { latest } from '@/server/services/notice.service';
import Container from '@/components/ui/Container';
import HeroSlider from '@/components/school/HeroSlider';
import SectionHeading, { Kicker } from '@/components/school/SectionHeading';
import NoticeCard from '@/components/school/NoticeCard';
import GalleryGrid from '@/components/school/GalleryGrid';
import { AdmissionCta, CampusMap, PillButton } from '@/components/school/Blocks';

async function readNotices() {
  try {
    return await latest(3);
  } catch {
    return [];
  }
}

async function readGallery() {
  try {
    return await listGallery();
  } catch {
    return [];
  }
}

function QuickLinks() {
  return (
    <Container className="relative z-20 -mt-20 sm:-mt-24">
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {quickLinks.map(({ title, text, href, cta, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center rounded-2xl border-b-4 border-navy-900 bg-white p-4 text-center shadow-xl shadow-navy-900/10 transition hover:-translate-y-1 hover:border-gold-400 sm:p-6"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white sm:h-14 sm:w-14">
              <Icon aria-hidden />
            </span>
            <span className="mt-3 font-display text-base font-bold text-navy-900 sm:text-lg">{title}</span>
            <span className="mt-1 hidden text-sm text-slate-500 sm:block">{text}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 sm:text-sm">
              {cta} <FaArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}

function Welcome() {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto w-full max-w-xl pb-10 pr-6 sm:pr-10 lg:mx-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-navy-900/20">
            <Image src={images.marchPast} alt="Students at the MA HAAD Annual Sports march past" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 aspect-[4/3] w-1/2 overflow-hidden rounded-2xl border-[6px] border-white shadow-xl">
            <Image src={images.scienceLab} alt="Students doing a science experiment" fill sizes="280px" className="object-cover" />
          </div>
          <div className="absolute -left-3 top-6 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 px-5 py-4 text-navy-950 shadow-xl sm:-left-6">
            <p className="font-display text-3xl font-bold leading-none">PG–X</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider">English Version</p>
          </div>
        </div>

        <div>
          <Kicker>About us</Kicker>
          <h2 className="mt-4 font-display text-3xl leading-tight text-navy-900 md:text-4xl">{welcome.title}</h2>
          <p className="mt-2 font-display text-lg italic text-gold-600">{welcome.tagline}</p>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p className="font-medium text-navy-900">{welcome.paragraphs[0]}</p>
            <p>{welcome.paragraphs[1]}</p>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm font-semibold text-navy-900">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-600"><Icon aria-hidden /></span>
                {label}
              </li>
            ))}
          </ul>
          <PillButton href="/about" className="mt-8">
            Read More <FaArrowRight aria-hidden />
          </PillButton>
        </div>
      </Container>
    </section>
  );
}

function LatestNotices({ notices }) {
  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <Container>
        <SectionHeading kicker="Stay updated" title="Latest Notices & Announcements" subtitle="Important updates, circulars and announcements from the school administration." />
        {notices.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => <NoticeCard key={notice._id} notice={notice} />)}
          </div>
        ) : (
          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <FaBullhorn className="text-3xl text-gold-500" aria-hidden />
            <p className="mt-4 font-semibold text-navy-900">New notices will appear here</p>
            <p className="mt-1 text-sm text-slate-500">For admission and other enquiries, call {siteConfig.contact.phones.join(' / ')}.</p>
          </div>
        )}
        <div className="mt-10 text-center">
          <PillButton href="/notices">View All Notices <FaArrowRight aria-hidden /></PillButton>
        </div>
      </Container>
    </section>
  );
}

function Programmes() {
  return (
    <section className="bg-brand-50/60 py-16 md:py-20">
      <Container>
        <SectionHeading kicker="Our programmes" title="Classes at MA HAAD" subtitle="English Version education following the National Curriculum of Bangladesh — from the first day of school to the SSC examination." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {programs.map((p) => (
            <Link key={p.slug} href={`/admission/${p.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={p.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute bottom-3 left-3 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-950">{p.level}</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-navy-900 group-hover:text-brand-700">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.classes.map((c) => (
                    <li key={c} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{c}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ValuesBand() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 py-16 md:py-20">
      <Image src={images.prizeWinners} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/95 via-navy-900/90 to-brand-800/85" aria-hidden />
      <Container>
        <SectionHeading light kicker="Character first" title="Values We Nurture" subtitle="We encourage our students to develop honesty, discipline, respect, kindness, teamwork, and a positive attitude towards life." />
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {values.map(({ icon: Icon, title }) => (
            <li key={title} className="flex flex-col items-center rounded-2xl bg-white/5 px-3 py-6 text-center ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10">
              <span className="flex h-14 w-14 items-center justify-center rounded-full text-xl text-gold-300 ring-2 ring-gold-400/60">
                <Icon aria-hidden />
              </span>
              <span className="mt-4 font-display text-lg text-white">{title}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Approach() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading kicker="Why choose us" title="Our Approach to Learning" subtitle="Learning that is enjoyable, purposeful and relevant to the needs of today’s learners." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {approach.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-brand-600 text-xl text-white shadow-lg shadow-brand-900/20">
                <Icon aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-lg text-navy-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Facilities() {
  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <Container>
        <SectionHeading kicker="Facilities" title="Everything a Learner Needs" subtitle="Well-equipped spaces and caring support that make every school day productive and safe." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map(({ slug, title, summary, icon: Icon }) => (
            <Link key={slug} href={`/facilities/${slug}`} className="group flex gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:ring-brand-300 hover:shadow-lg">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-xl text-gold-600 transition group-hover:bg-gold-400 group-hover:text-navy-950">
                <Icon aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-lg text-navy-900 group-hover:text-brand-700">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function GalleryPreview({ photos }) {
  if (!photos.length) return null;
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading kicker="Campus life" title="Photo Gallery" subtitle="Moments from our sports, cultural programmes and classrooms." />
        <div className="mt-10">
          <GalleryGrid items={photos} limit={6} />
        </div>
        <div className="mt-10 text-center">
          <PillButton href="/gallery">View Full Gallery <FaArrowRight aria-hidden /></PillButton>
        </div>
      </Container>
    </section>
  );
}

export default async function HomePage() {
  const [notices, photos] = await Promise.all([readNotices(), readGallery()]);
  return (
    <>
      <HeroSlider slides={heroSlides} />
      <QuickLinks />
      <Welcome />
      <LatestNotices notices={notices} />
      <Programmes />
      <ValuesBand />
      <Approach />
      <Facilities />
      <GalleryPreview photos={photos} />
      <AdmissionCta />
      <CampusMap />
    </>
  );
}
