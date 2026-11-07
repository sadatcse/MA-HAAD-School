import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FaFilePdf, FaPhoneAlt, FaCheckCircle } from 'react-icons/fa';
import { siteConfig, telHref } from '@/config/site';
import { sectionLinks } from '@/config/navigation';
import { programs, admissionInfo, rules, transferProcedure, prospectus, images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SubpageLayout from '@/components/school/SubpageLayout';
import { Kicker } from '@/components/school/SectionHeading';
import { CheckList, PillButton } from '@/components/school/Blocks';
import PrintButton from '@/components/school/PrintButton';

const PAGES = {
  information: { title: 'Admission Information', description: admissionInfo.intro },
  'rules-and-regulations': { title: 'Rules and Regulations', description: 'Attendance, uniform, conduct, examinations, fees and guidance for parents.' },
  'transfer-procedure': { title: 'Transfer Procedure', description: transferProcedure.intro },
  prospectus: { title: 'Prospectus', description: prospectus.intro },
};

function pageFor(slug) {
  const program = programs.find((p) => p.slug === slug);
  if (program) return { title: program.title, description: program.summary, program };
  return PAGES[slug];
}

export function generateStaticParams() {
  return [...programs.map((p) => p.slug), ...Object.keys(PAGES)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const page = pageFor((await params).slug);
  return page ? { title: page.title, description: page.description } : {};
}

function Heading({ kicker, title }) {
  return (
    <div>
      <Kicker>{kicker}</Kicker>
      <h2 className="mt-4 font-display text-3xl text-navy-900">{title}</h2>
    </div>
  );
}

function Steps({ steps }) {
  return (
    <ol className="relative mt-6 space-y-4 border-l-2 border-dashed border-brand-200 pl-8">
      {steps.map((step, i) => (
        <li key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="absolute -left-[3.05rem] top-5 flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white ring-4 ring-white">{i + 1}</span>
          <p className="font-semibold text-navy-900">{step.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

function Program({ program }) {
  return (
    <>
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-xl shadow-navy-900/10">
        <Image src={program.image} alt="" fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" preload />
        <span className="absolute left-4 top-4 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy-950">{program.level}</span>
      </div>
      <div className="mt-10">
        <Heading kicker="Admission" title={program.title} />
      </div>
      <div className="prose-school mt-5">
        {program.paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <p className="bg-navy-900 px-5 py-3 font-display text-lg text-white">Age guideline</p>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {program.ages.map((row) => (
                <tr key={row.className}>
                  <th scope="row" className="px-5 py-3 text-left font-semibold text-navy-900">{row.className}</th>
                  <td className="px-5 py-3 text-right text-slate-600">{row.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">Age as of 1 January of the admission year.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-display text-lg text-navy-900">Main subjects</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {program.subjects.map((s) => (
              <li key={s} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border-l-4 border-gold-400 bg-gold-50 p-6">
        <p className="font-display text-lg text-navy-900">Admission test</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{program.assessment}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <PillButton href="/admission/information">How to apply</PillButton>
        <PillButton href={telHref(siteConfig.contact.phones[0])} variant="outline"><FaPhoneAlt aria-hidden /> {siteConfig.contact.phones[0]}</PillButton>
      </div>
    </>
  );
}

function Information() {
  return (
    <>
      <Heading kicker="How to apply" title="Admission Information" />
      <p className="prose-school mt-5">{admissionInfo.intro}</p>

      <h3 className="mt-10 font-display text-2xl text-navy-900">Admission steps</h3>
      <Steps steps={admissionInfo.steps} />

      <h3 className="mt-12 font-display text-2xl text-navy-900">Documents required</h3>
      <CheckList items={admissionInfo.documents} className="mt-5" />

      <h3 className="mt-12 font-display text-2xl text-navy-900">Age guideline</h3>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="bg-navy-900 text-left text-white">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">Class</th>
              <th scope="col" className="px-5 py-3 font-semibold">Level</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Minimum age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {programs.flatMap((p) =>
              p.ages.map((row) => (
                <tr key={row.className} className="even:bg-slate-50/60">
                  <td className="px-5 py-2.5 font-medium text-navy-900">{row.className}</td>
                  <td className="px-5 py-2.5 text-slate-500">{p.level}</td>
                  <td className="px-5 py-2.5 text-right text-slate-600">{row.age}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 rounded-2xl bg-brand-50 p-6">
        <p className="font-display text-lg text-navy-900">Please note</p>
        <ul className="prose-school mt-3">
          {admissionInfo.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </div>
    </>
  );
}

function Rules() {
  return (
    <>
      <Heading kicker="For students & parents" title="Rules and Regulations" />
      <p className="prose-school mt-5">
        These rules help us keep MA HAAD a safe, disciplined and happy place to learn. Every student and parent is expected to read and follow them.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {rules.map((section, i) => (
          <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-3 font-display text-xl text-navy-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100 text-sm font-bold text-gold-700">{i + 1}</span>
              {section.title}
            </h3>
            <ul className="prose-school mt-4 !text-sm">
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ))}
      </div>
      <div className="mt-8"><PrintButton label="Print rules" /></div>
    </>
  );
}

function Transfer() {
  return (
    <>
      <Heading kicker="Transfer Certificate (TC)" title="Transfer Procedure" />
      <p className="prose-school mt-5">{transferProcedure.intro}</p>

      <h3 className="mt-10 font-display text-2xl text-navy-900">Leaving MA HAAD</h3>
      <Steps steps={transferProcedure.leaving} />

      <h3 className="mt-12 font-display text-2xl text-navy-900">Joining MA HAAD from another school</h3>
      <CheckList items={transferProcedure.joining} className="mt-5" />

      <div className="mt-10 rounded-2xl border-l-4 border-gold-400 bg-gold-50 p-6">
        <ul className="prose-school !text-sm">
          {transferProcedure.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </div>
    </>
  );
}

function Prospectus() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading kicker="Online prospectus" title="Prospectus" />
        <div className="flex flex-wrap gap-3">
          {prospectus.pdf && (
            <PillButton href={prospectus.pdf} target="_blank" rel="noopener noreferrer"><FaFilePdf aria-hidden /> Download PDF</PillButton>
          )}
          <PrintButton label="Print prospectus" />
        </div>
      </div>
      <p className="prose-school mt-5">{prospectus.intro}</p>

      <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-3xl">
        <Image src={images.sportsTeam} alt="" fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
        <div className="absolute inset-0 flex items-center bg-gradient-to-r from-navy-950/90 to-transparent p-8">
          <div>
            <p className="font-display text-2xl text-white md:text-3xl">{siteConfig.name}</p>
            <p className="mt-1 font-display italic text-gold-300">{siteConfig.tagline}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {prospectus.sections.map((s) => (
          <section key={s.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <FaCheckCircle className="mt-1 shrink-0 text-lg text-brand-600" aria-hidden />
            <div>
              <h3 className="font-display text-lg text-navy-900">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.text}</p>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default async function AdmissionDetailPage({ params }) {
  const { slug } = await params;
  const page = pageFor(slug);
  if (!page) notFound();

  const body = page.program ? (
    <Program program={page.program} />
  ) : slug === 'information' ? (
    <Information />
  ) : slug === 'rules-and-regulations' ? (
    <Rules />
  ) : slug === 'transfer-procedure' ? (
    <Transfer />
  ) : (
    <Prospectus />
  );

  return (
    <>
      <PageBanner
        title={page.title}
        subtitle={page.program ? page.description : 'Admission · MA HAAD School & College'}
        breadcrumbs={[{ label: 'Admission', href: '/admission' }, { label: page.title }]}
        image={page.program?.image || images.newYear}
      />
      <SubpageLayout title="Admission" links={sectionLinks('/admission')} current={`/admission/${slug}`}>
        {body}
      </SubpageLayout>
    </>
  );
}
