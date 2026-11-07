import { Fragment } from 'react';
import Link from 'next/link';
import { FaEnvelope } from 'react-icons/fa';
import { legalDocs, LEGAL_ORDER } from '@/data/legal';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import PageBanner from '@/components/school/PageBanner';

// Renders **bold** and [label](/link) inside a paragraph
function Inline({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold text-ink">{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <Link key={i} href={link[2]} className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400">
          {link[1]}
        </Link>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Block({ block }) {
  if (typeof block === 'string') return <p className="leading-relaxed text-body"><Inline text={block} /></p>;
  return (
    <ul className="space-y-2 pl-5 text-body marker:text-brand-500 [list-style:disc]">
      {block.list.map((item) => <li key={item} className="pl-1 leading-relaxed"><Inline text={item} /></li>)}
    </ul>
  );
}

// Fills the {{email}} / {{address}} placeholders in src/data/legal.js with the contact details from src/config/site.js
function fill(block) {
  const { email, address } = siteConfig.contact;
  const sub = (text) => text.replaceAll('{{email}}', email).replaceAll('{{address}}', address);
  return typeof block === 'string' ? sub(block) : { ...block, list: block.list?.map(sub) };
}

// Shared layout for every /legal page. Text lives in src/data/legal.js; `docKey` is the route name.
export default function LegalPage({ docKey }) {
  const raw = legalDocs[docKey];
  const doc = { ...raw, sections: raw.sections.map((s) => ({ ...s, body: s.body.map(fill) })) };
  const { email } = siteConfig.contact;

  return (
    <div className="bg-white">
      <PageBanner title={doc.title} subtitle={doc.summary} breadcrumbs={[{ label: 'Legal' }, { label: doc.title }]} />
      <div className="border-b border-slate-200 bg-white">
        <nav aria-label="Legal documents" className="container flex max-w-6xl gap-2 overflow-x-auto py-4 scrollbar-none">
          {LEGAL_ORDER.map((key) => (
            <Link
              key={key}
              href={`/legal/${key}`}
              aria-current={key === docKey ? 'page' : undefined}
              className={cn(
                'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                key === docKey ? 'border-transparent bg-navy-900 text-white' : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700'
              )}
            >
              {legalDocs[key].title}
            </Link>
          ))}
        </nav>
        <p className="container max-w-6xl pb-4 text-xs text-slate-500">Last updated: {doc.lastUpdated}</p>
      </div>

      <div className="container max-w-6xl py-10 md:py-14 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        <aside className="mb-8 lg:mb-0">
          <details className="rounded-xl border border-line/10 bg-surface p-4 lg:sticky lg:top-24 lg:border-0 lg:bg-transparent lg:p-0" open>
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest text-subtle lg:pointer-events-none lg:list-none">On this page</summary>
            <ol className="mt-3 space-y-1.5 text-sm">
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-2 text-muted transition-colors hover:text-brand-600 dark:hover:text-brand-400">
                    <span className="w-5 shrink-0 text-faint">{i + 1}.</span> {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <div className="space-y-10">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="mb-3 flex items-baseline gap-3 text-xl">
                  <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{String(i + 1).padStart(2, '0')}</span>
                  {s.heading}
                </h2>
                <div className="space-y-3">
                  {s.body.map((block, j) => <Block key={j} block={block} />)}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-line/10 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-ink">Still have a question?</p>
              <p className="text-sm text-muted">We usually reply within a few working days.</p>
            </div>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-navy-900 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
              <FaEnvelope aria-hidden /> {email}
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
