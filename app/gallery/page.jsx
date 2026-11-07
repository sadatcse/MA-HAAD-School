import { FaImages } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { images } from '@/data/school';
import { listGallery } from '@/server/services/content.service';
import PageBanner from '@/components/school/PageBanner';
import SectionHeading from '@/components/school/SectionHeading';
import Container from '@/components/ui/Container';
import GalleryGrid from '@/components/school/GalleryGrid';

export const metadata = {
  title: 'Photo Gallery',
  description: `Photos of sports, cultural programmes and classroom life at ${siteConfig.name}.`,
};

// Photos are managed in Dashboard → Photo Gallery
export default async function GalleryPage() {
  const photos = await listGallery().catch(() => []);
  const categories = ['All', ...new Set(photos.map((p) => p.category).filter(Boolean))];

  return (
    <>
      <PageBanner title="Photo Gallery" subtitle="Moments and memories from MA HAAD." breadcrumbs={[{ label: 'Photo Gallery' }]} image={images.trophy} />
      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading kicker="Moments & memories" title="Life at MA HAAD" subtitle="Explore moments from our sports, cultural programmes and academic life." />
          <div className="mt-10">
            {photos.length ? (
              <GalleryGrid items={photos} categories={categories} />
            ) : (
              <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <FaImages className="text-4xl text-gold-500" aria-hidden />
                <p className="mt-4 font-display text-xl text-navy-900">New photos are coming soon</p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
