import { getTimeZone } from './timezone';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function escapeRegex(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Date (and optional time) in the site timezone set in Dashboard → Settings
export function formatDate(value, withTime = false) {
  if (!value) return '—';
  const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: getTimeZone() };
  if (withTime) Object.assign(options, { hour: '2-digit', minute: '2-digit' });
  return new Date(value).toLocaleString('en-GB', options);
}

// { day: '07', month: 'Nov', year: '2026' } in the site timezone — for date badges
export function dateParts(value) {
  const parts = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: getTimeZone() })
    .formatToParts(new Date(value))
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});
  return { day: parts.day, month: parts.month, year: parts.year };
}

// "YYYY-MM-DD" in the site timezone — for <input type="date">
export function toDateInput(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-CA', { timeZone: getTimeZone(), year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value));
}
