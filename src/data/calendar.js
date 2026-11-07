// Built-in session 2027: copied into the database by `npm run seed-content`, and shown only if the
// database has no session. Holidays and the calendar are managed in Dashboard → Academic Sessions.
// EVENT_TYPES (colours and labels) is used by the website and the dashboard.
// Dates are YYYY-MM-DD; add `end` for a range. `tentative: true` marks dates that depend on the moon
// or on a Government / Education Board notice — the school confirms them by notice.
export const session = {
  year: 2027,
  label: 'Session 2027',
  start: '2027-01-01',
  // Weekly holidays (0 = Sunday … 6 = Saturday)
  weekend: [5, 6],
  weekendLabel: 'Friday & Saturday',
  // false = shown as a draft plan on the website
  confirmed: false,
};

export const EVENT_TYPES = {
  holiday: { label: 'Holiday', dot: 'bg-rose-500', cell: 'bg-rose-100 text-rose-800' },
  vacation: { label: 'Vacation', dot: 'bg-violet-500', cell: 'bg-violet-100 text-violet-800' },
  exam: { label: 'Examination', dot: 'bg-sky-500', cell: 'bg-sky-100 text-sky-800' },
  event: { label: 'Activities & Events', dot: 'bg-amber-500', cell: 'bg-amber-100 text-amber-800' },
  meeting: { label: 'Parent–Teacher Meeting / Result', dot: 'bg-emerald-500', cell: 'bg-emerald-100 text-emerald-800' },
};

export const holidays = [
  { date: '2027-01-24', title: 'Shab-e-Barat', type: 'holiday', kind: 'Religious', tentative: true },
  { date: '2027-02-21', title: 'Shaheed Day & International Mother Language Day', type: 'holiday', kind: 'National' },
  { date: '2027-03-05', title: 'Shab-e-Qadr', type: 'holiday', kind: 'Religious', tentative: true },
  { date: '2027-03-07', end: '2027-03-16', title: 'Eid-ul-Fitr vacation', type: 'vacation', kind: 'Religious', tentative: true },
  { date: '2027-03-26', title: 'Independence & National Day', type: 'holiday', kind: 'National' },
  { date: '2027-04-14', title: 'Pohela Boishakh (Bangla New Year)', type: 'holiday', kind: 'National' },
  { date: '2027-05-01', title: 'May Day', type: 'holiday', kind: 'National' },
  { date: '2027-05-14', end: '2027-05-22', title: 'Eid-ul-Adha vacation', type: 'vacation', kind: 'Religious', tentative: true },
  { date: '2027-05-20', title: 'Buddha Purnima', type: 'holiday', kind: 'Religious', tentative: true },
  { date: '2027-06-15', title: 'Holy Ashura', type: 'holiday', kind: 'Religious', tentative: true },
  { date: '2027-08-15', title: 'Eid-e-Miladunnabi', type: 'holiday', kind: 'Religious', tentative: true },
  { date: '2027-08-25', title: 'Janmashtami', type: 'holiday', kind: 'Religious', tentative: true },
  { date: '2027-10-10', end: '2027-10-14', title: 'Durga Puja vacation', type: 'vacation', kind: 'Religious', tentative: true },
  { date: '2027-12-16', title: 'Victory Day', type: 'holiday', kind: 'National' },
  { date: '2027-12-17', end: '2027-12-31', title: 'Winter vacation', type: 'vacation', kind: 'School' },
  { date: '2027-12-25', title: 'Christmas Day', type: 'holiday', kind: 'Religious' },
];

export const academicEvents = [
  { date: '2027-01-01', title: 'New session begins · Book distribution festival', type: 'event' },
  { date: '2027-01-03', title: 'Regular classes begin', type: 'event' },
  { date: '2027-02-04', title: 'Annual Sports Day', type: 'event', tentative: true },
  { date: '2027-02-21', title: 'Mother Language Day programme', type: 'event' },
  { date: '2027-03-25', title: 'Independence Day celebration', type: 'event' },
  { date: '2027-04-13', title: 'Pohela Boishakh celebration', type: 'event' },
  { date: '2027-04-18', end: '2027-04-27', title: 'First Term Examination', type: 'exam', tentative: true },
  { date: '2027-05-06', title: 'First Term result & parent–teacher meeting', type: 'meeting', tentative: true },
  { date: '2027-06-20', end: '2027-07-01', title: 'Half-Yearly Examination', type: 'exam', tentative: true },
  { date: '2027-07-15', title: 'Half-Yearly result & parent–teacher meeting', type: 'meeting', tentative: true },
  { date: '2027-08-12', title: 'Science fair', type: 'event', tentative: true },
  { date: '2027-09-16', title: 'Inter-class debate competition', type: 'event', tentative: true },
  { date: '2027-09-26', end: '2027-10-05', title: 'Second Term Examination', type: 'exam', tentative: true },
  { date: '2027-11-07', title: 'Cultural programme & art competition', type: 'event', tentative: true },
  { date: '2027-11-14', end: '2027-11-30', title: 'Annual Examination', type: 'exam', tentative: true },
  { date: '2027-12-12', title: 'Annual result & report cards', type: 'meeting', tentative: true },
  { date: '2027-12-15', title: 'Victory Day programme', type: 'event' },
];
