import { siteConfig } from '@/config/site';
import { sectionLinks } from '@/config/navigation';
import { EVENT_TYPES } from '@/data/calendar';
import { currentSession } from '@/server/services/content.service';
import { images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SubpageLayout from '@/components/school/SubpageLayout';
import { Kicker } from '@/components/school/SectionHeading';
import PrintButton from '@/components/school/PrintButton';
import { formatRange, weekdayOf } from '@/components/school/YearCalendar';
import { cn } from '@/lib/utils';

export async function generateMetadata() {
  const session = await currentSession();
  return { title: 'List of Holidays', description: `Holidays for ${session.label} at ${siteConfig.name}.` };
}

const days = (h) => (h.end ? Math.round((new Date(`${h.end}T00:00:00Z`) - new Date(`${h.date}T00:00:00Z`)) / 86400000) + 1 : 1);

// The session is managed in Dashboard → Academic Sessions
export default async function HolidaysPage() {
  const session = await currentSession();
  const list = [...session.holidays].sort((a, b) => a.date.localeCompare(b.date));
  const total = list.reduce((sum, h) => sum + days(h), 0);

  return (
    <>
      <PageBanner title="List of Holidays" subtitle={session.label} breadcrumbs={[{ label: 'Campus', href: '/campus' }, { label: 'List of Holidays' }]} image={images.cultural} />
      <SubpageLayout title="Campus" links={sectionLinks('/campus')} current="/campus/holidays">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>{session.label}</Kicker>
            <h2 className="mt-4 font-display text-3xl text-navy-900">Holidays & Vacations</h2>
          </div>
          <PrintButton label="Print list" />
        </div>
        <p className="prose-school mt-4">
          Weekly holidays: <strong>{session.weekendLabel}</strong>. Religious holidays depend on the sighting of the moon, so dates marked
          <em> tentative</em> may change — the school will confirm every holiday by notice.
        </p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-navy-900 text-left text-white">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">#</th>
                <th scope="col" className="px-4 py-3 font-semibold">Occasion</th>
                <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                <th scope="col" className="px-4 py-3 font-semibold">Day</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((h, i) => (
                <tr key={`${h.date}-${h.title}`} className="even:bg-slate-50/60">
                  <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{h.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className={cn('h-2 w-2 rounded-full', (EVENT_TYPES[h.type] || EVENT_TYPES.holiday).dot)} aria-hidden /> {h.kind || (EVENT_TYPES[h.type] || EVENT_TYPES.holiday).label}
                      {h.tentative && <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800">Tentative</span>}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatRange(h)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {weekdayOf(h.date)}{h.end ? ` – ${weekdayOf(h.end)}` : ''}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-navy-900">{days(h)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-brand-50">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right font-semibold text-navy-900">Total (calendar days, including weekends)</td>
                <td className="px-4 py-3 text-right font-bold text-brand-700">{total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SubpageLayout>
    </>
  );
}
