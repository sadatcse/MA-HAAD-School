// Notice category labels and colours — shared by the website and the dashboard
export const NOTICE_CATEGORY_STYLES = {
  general: { label: 'General', className: 'bg-slate-100 text-slate-700' },
  admission: { label: 'Admission', className: 'bg-sky-100 text-sky-700' },
  exam: { label: 'Exam', className: 'bg-indigo-100 text-indigo-700' },
  holiday: { label: 'Holiday', className: 'bg-rose-100 text-rose-700' },
  event: { label: 'Event', className: 'bg-amber-100 text-amber-800' },
  result: { label: 'Result', className: 'bg-emerald-100 text-emerald-700' },
  important: { label: 'Important', className: 'bg-red-600 text-white' },
};

export const NOTICE_CATEGORY_OPTIONS = Object.entries(NOTICE_CATEGORY_STYLES).map(([value, { label }]) => ({ value, label }));

export const categoryStyle = (category) => NOTICE_CATEGORY_STYLES[category] || NOTICE_CATEGORY_STYLES.general;

// Notices from the last 7 days get a "NEW" badge
export const isNew = (date) => Date.now() - new Date(date).getTime() < 7 * 86400000;
