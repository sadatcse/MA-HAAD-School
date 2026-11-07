import { FaInfoCircle } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { EVENT_TYPES } from '@/data/calendar';
import { currentSession } from '@/server/services/content.service';
import { images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SectionHeading from '@/components/school/SectionHeading';
import Container from '@/components/ui/Container';
import PrintButton from '@/components/school/PrintButton';
import YearCalendar, { Legend, formatRange } from '@/components/school/YearCalendar';
import { cn } from '@/lib/utils';

export async function generateMetadata() {
  const session = await currentSession();
  return {
    title: 'Academic Calendar',
    description: `Academic calendar for ${session.label} at ${siteConfig.name} — examinations, events and holidays.`,
  };
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Working days = weekdays that are not a holiday or vacation
function workingDays(entries, session) {
  const off = new Set();
  entries
    .filter((e) => e.type === 'holiday' || e.type === 'vacation')
    .forEach((e) => {
      const d = new Date(`${e.date}T00:00:00Z`);
      const end = new Date(`${e.end || e.date}T00:00:00Z`);
      for (; d <= end; d.setUTCDate(d.getUTCDate() + 1)) off.add(d.toISOString().slice(0, 10));
    });
  let count = 0;
  const d = new Date(Date.UTC(session.year, 0, 1));
  while (d.getUTCFullYear() === session.year) {
    if (!session.weekend.includes(d.getUTCDay()) && !off.has(d.toISOString().slice(0, 10))) count += 1;
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return count;
}

// The session is managed in Dashboard → Academic Sessions
export default async function AcademicCalendarPage() {
  const session = await currentSession();
  const entries = [...session.events, ...session.holidays].sort((a, b) => a.date.localeCompare(b.date));
  const byMonth = MONTHS.map((name, m) => ({ name, items: entries.filter((e) => Number(e.date.slice(5, 7)) === m + 1) })).filter((m) => m.items.length);

  return (
    <>
      <PageBanner title="Academic Calendar" subtitle={session.label} breadcrumbs={[{ label: 'Campus', href: '/campus' }, { label: 'Academic Calendar' }]} image={images.podium} />

      <section className="py-14 md:py-16">
        <Container>
          <SectionHeading kicker={session.label} title={`Academic Calendar ${session.year}`} subtitle="Examinations, events, parent–teacher meetings, holidays and vacations at a glance." />

          {!session.confirmed && (
            <p className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
              <FaInfoCircle className="mt-0.5 shrink-0" aria-hidden />
              This is a tentative plan. Final dates for examinations, events and religious holidays are confirmed by notice — please check the Notice Board.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <Legend weekendLabel={session.weekendLabel} />
            <PrintButton label="Print calendar" className="shrink-0" />
          </div>

          <div className="mt-6">
            <YearCalendar year={session.year} entries={entries} weekend={session.weekend} />
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-2xl bg-navy-900 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-300">Working days</p>
                <p className="mt-2 font-display text-5xl">{workingDays(entries, session)}</p>
                <p className="mt-2 text-sm text-white/70">School resumes: 1 January {session.year} (new session & book festival)</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                <p className="font-semibold text-navy-900">Weekly holidays</p>
                <p className="mt-1">{session.weekendLabel}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-[130px_1fr] bg-navy-900 px-5 py-3 text-sm font-semibold text-white sm:grid-cols-[160px_1fr]">
                <span>Key dates</span>
                <span>Details / activities</span>
              </div>
              {byMonth.map((month) => (
                <div key={month.name}>
                  <p className="bg-brand-50 px-5 py-2 text-center text-sm font-bold text-brand-800">{month.name} {session.year}</p>
                  <ul className="divide-y divide-slate-100">
                    {month.items.map((e) => (
                      <li key={`${e.date}-${e.title}`} className="grid grid-cols-[130px_1fr] items-start gap-2 px-5 py-2.5 text-sm sm:grid-cols-[160px_1fr]">
                        <span className="font-medium text-navy-900">{formatRange(e)}</span>
                        <span className="flex flex-wrap items-center gap-2 text-slate-600">
                          <span className={cn('h-2 w-2 shrink-0 rounded-full', (EVENT_TYPES[e.type] || EVENT_TYPES.event).dot)} aria-hidden />
                          {e.title}
                          {e.tentative && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">Tentative</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
