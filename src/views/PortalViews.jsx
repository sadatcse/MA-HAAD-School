import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowRight, FaUserLock } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { portalGroups, getPortal } from '@/data/portals';
import { images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SectionHeading from '@/components/school/SectionHeading';
import Container from '@/components/ui/Container';
import PortalLogin from '@/components/school/PortalLogin';

// Shared by /portal (School Management Login) and /requisition (Requisition Login)

export function portalIndexMetadata(key) {
  const group = portalGroups[key];
  return { title: group.title, description: `${group.description} — ${siteConfig.name}`, robots: { index: false } };
}

export function PortalIndex({ groupKey }) {
  const group = portalGroups[groupKey];
  return (
    <>
      <PageBanner title={group.title} subtitle={group.description} breadcrumbs={[{ label: group.title }]} image={images.sportsTeam} />
      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading kicker="Secure access" title="Choose your portal" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((p) => (
              <Link
                key={p.slug}
                href={`/${group.key}/${p.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-brand-600 text-white">
                  <FaUserLock aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg text-navy-900 group-hover:text-brand-700">{p.title}</span>
                  <span className="block truncate text-sm text-slate-500">{p.audience}</span>
                </span>
                <FaArrowRight className="text-gold-500 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

export function portalParams(key) {
  return portalGroups[key].items.map(({ slug }) => ({ slug }));
}

export async function portalMetadata(key, params) {
  const portal = getPortal(key, (await params).slug);
  if (!portal) return {};
  return { title: `${portal.title} — ${portalGroups[key].title}`, robots: { index: false } };
}

export async function PortalPage({ groupKey, params }) {
  const { slug } = await params;
  const group = portalGroups[groupKey];
  const portal = getPortal(groupKey, slug);
  if (!portal) notFound();
  // Only plain data goes to the client component
  const groupInfo = { key: group.key, title: group.title };

  return (
    <>
      <PageBanner title={portal.title} subtitle={group.title} breadcrumbs={[{ label: group.title, href: `/${group.key}` }, { label: portal.title }]} image={images.sportsTeam} />
      <section className="bg-slate-50 py-12 md:py-16">
        <Container>
          <PortalLogin portal={portal} group={groupInfo} siblings={group.items.map(({ slug: s, title }) => ({ slug: s, title }))} />
        </Container>
      </section>
    </>
  );
}
