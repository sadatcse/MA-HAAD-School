import { EVENT_TYPES } from '@/data/calendar';
import { cn } from '@/lib/utils';

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// When several things fall on one day, the first in this list colours the cell
const PRIORITY = ['holiday', 'vacation', 'exam', 'meeting', 'event'];

const pad = (n) => String(n).padStart(2, '0');
const key = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

// "YYYY-MM-DD" → every date string from start to end (inclusive)
function expand(start, end = start) {
  const out = [];
  const d = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (d <= last) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

export function buildDayMap(entries) {
  const map = new Map();
  entries.forEach((entry) => {
    expand(entry.date, entry.end).forEach((date) => {
      const list = map.get(date) || [];
      list.push(entry);
      map.set(date, list);
    });
  });
  return map;
}

export function formatRange(entry) {
  const opts = { day: 'numeric', month: 'short', timeZone: 'UTC' };
  const start = new Date(`${entry.date}T00:00:00Z`);
  const a = start.toLocaleDateString('en-GB', opts);
  if (!entry.end || entry.end === entry.date) return a;
  return `${a} – ${new Date(`${entry.end}T00:00:00Z`).toLocaleDateString('en-GB', opts)}`;
}

export function weekdayOf(date) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' });
}

function Month({ year, month, dayMap, weekend }) {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 font-display text-lg text-navy-900">
        {MONTHS[month]} <span className="text-gold-600">’{String(year).slice(2)}</span>
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DAY_NAMES.map((d, i) => (
          <span key={i} className={cn('py-1 font-semibold', weekend.includes(i) ? 'text-emerald-700' : 'text-slate-400')}>{d}</span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={`e-${i}`} />;
          const date = key(year, month, day);
          const entries = dayMap.get(date) || [];
          const type = PRIORITY.find((t) => entries.some((e) => e.type === t));
          const isWeekend = weekend.includes((first + day - 1) % 7);
          return (
            <span
              key={date}
              title={entries.map((e) => e.title).join(' · ') || undefined}
              className={cn(
                'flex aspect-square items-center justify-center rounded-md font-medium',
                type ? EVENT_TYPES[type].cell : isWeekend ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              )}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function Legend({ weekendLabel }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
      {Object.entries(EVENT_TYPES).map(([type, { label, cell }]) => (
        <li key={type} className="flex items-center gap-2">
          <span className={cn('h-4 w-4 rounded', cell)} aria-hidden /> {label}
        </li>
      ))}
      <li className="flex items-center gap-2">
        <span className="h-4 w-4 rounded bg-emerald-50 ring-1 ring-emerald-200" aria-hidden /> Weekend ({weekendLabel})
      </li>
    </ul>
  );
}

// Twelve month grids for one year, colour-coded by event type
export default function YearCalendar({ year, entries, weekend }) {
  const dayMap = buildDayMap(entries);
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 12 }, (_, m) => (
        <Month key={m} year={year} month={m} dayMap={dayMap} weekend={weekend} />
      ))}
    </div>
  );
}
