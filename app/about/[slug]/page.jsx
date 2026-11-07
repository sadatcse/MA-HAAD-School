import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { messages } from '@/data/school';
import { getLeader } from '@/server/services/content.service';
import PageBanner from '@/components/school/PageBanner';
import Container from '@/components/ui/Container';
import { PersonPhoto } from '@/components/school/Blocks';

// Message saved in Dashboard → CEO & Principal, or the built-in text if the database can't be reached
async function readMessage(slug) {
  if (!messages[slug]) return null;
  try {
    return await getLeader(slug);
  } catch {
    return messages[slug];
  }
}

export async function generateMetadata({ params }) {
  const message = await readMessage((await params).slug);
  if (!message) return {};
  return { title: message.label, description: message.excerpt };
}

export default async function MessagePage({ params }) {
  const { slug } = await params;
  const message = await readMessage(slug);
  if (!message) notFound();

  const other = Object.values(messages).find((m) => m.slug !== slug);
  const displayName = message.name || message.role;

  return (
    <>
      <PageBanner
        title={message.label}
        subtitle={siteConfig.name}
        breadcrumbs={[{ label: 'About Us', href: '/about' }, { label: message.label }]}
        image={message.banner}
      />

      <section className="bg-slate-50 py-12 md:py-16">
        <Container className="max-w-5xl">
          <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:grid-cols-[240px_1fr] md:gap-10 md:p-10">
            {/* Photo and name */}
            <aside className="mx-auto w-full max-w-[240px] md:sticky md:top-20 md:self-start">
              <PersonPhoto photo={message.photo} name={displayName} className="aspect-[5/6] rounded-xl border border-slate-200" sizes="240px" />
              <div className="mt-4 border-t-4 border-gold-400 pt-3 text-center">
                <p className="font-display text-lg font-bold leading-snug text-navy-900">{displayName}</p>
                {message.name && <p className="text-sm font-medium text-brand-700">{message.role}</p>}
                <p className="text-xs text-slate-500">{siteConfig.name}</p>
              </div>
            </aside>

            {/* Message */}
            <article>
              <h2 className="font-display text-2xl text-navy-900 sm:text-3xl">{message.heading}</h2>
              <div className="mt-3 h-1 w-14 rounded-full bg-gold-400" aria-hidden />
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                {message.paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
              </div>

              <div className="mt-8 border-t border-slate-200 pt-5">
                <p className="text-sm text-slate-500">With best wishes,</p>
                <p className="mt-1 font-display text-lg font-bold text-navy-900">{displayName}</p>
                <p className="text-sm text-slate-500">
                  {message.name ? `${message.role}, ` : ''}
                  {siteConfig.name}
                </p>
              </div>
            </article>
          </div>

          {other && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
              <p className="text-sm text-slate-600">
                Also read the <span className="font-semibold text-navy-900">{other.label}</span>
              </p>
              <Link href={`/about/${other.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-gold-600">
                Read message <FaArrowRight aria-hidden />
              </Link>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
