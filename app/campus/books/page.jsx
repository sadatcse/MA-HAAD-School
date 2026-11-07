import { FaBook } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { sectionLinks } from '@/config/navigation';
import { currentSession } from '@/server/services/content.service';
import { images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SubpageLayout from '@/components/school/SubpageLayout';
import { Kicker } from '@/components/school/SectionHeading';
import PrintButton from '@/components/school/PrintButton';
import { cn } from '@/lib/utils';

export async function generateMetadata() {
  const { year } = await currentSession();
  return { title: 'Books', description: `Class-wise book list for session ${year} at ${siteConfig.name}.` };
}

// The book list is part of the session in Dashboard → Academic Sessions
export default async function BooksPage() {
  const { year: booksSession, books: bookLevels } = await currentSession();
  return (
    <>
      <PageBanner title="Books" subtitle={`Book list · Session ${booksSession}`} breadcrumbs={[{ label: 'Campus', href: '/campus' }, { label: 'Books' }]} image={images.bookFestival} />
      <SubpageLayout title="Campus" links={sectionLinks('/campus')} current="/campus/books">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Session {booksSession}</Kicker>
            <h2 className="mt-4 font-display text-3xl text-navy-900">Book List</h2>
          </div>
          <PrintButton label="Print book list" />
        </div>
        <p className="prose-school mt-4">
          From Class I, students follow the <strong>NCTB textbooks (English Version)</strong>, which are provided free of cost by the Government of Bangladesh.
          Books marked <strong>School</strong> are selected by MA HAAD and are available through the school office.
        </p>
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          <li className="flex items-center gap-2"><span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">NCTB</span> Government textbook</li>
          <li className="flex items-center gap-2"><span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-gold-700">School</span> Selected by MA HAAD</li>
        </ul>

        <div className="mt-10 space-y-10">
          {bookLevels.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">The book list for session {booksSession} will be published soon.</p>}
          {bookLevels.map((level) => (
            <section key={level.level}>
              <h3 className="flex items-center gap-3 font-display text-2xl text-navy-900">
                <span className="h-6 w-1.5 rounded-full bg-gold-400" aria-hidden /> {level.level}
              </h3>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {level.classes.map((cls) => (
                  <div key={cls.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <p className="flex items-center gap-2 bg-navy-900 px-5 py-3 font-semibold text-white">
                      <FaBook className="text-gold-400" aria-hidden /> {cls.name}
                    </p>
                    <ol className="divide-y divide-slate-100 text-sm">
                      {cls.books.map((book, i) => (
                        <li key={`${i}-${book.title}`} className="flex items-center gap-3 px-5 py-2.5">
                          <span className="w-5 shrink-0 text-xs font-semibold text-slate-400">{i + 1}.</span>
                          <span className="flex-1 text-slate-700">{book.title}</span>
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', book.source === 'NCTB' ? 'bg-brand-100 text-brand-700' : 'bg-gold-100 text-gold-700')}>
                            {book.source}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </SubpageLayout>
    </>
  );
}
