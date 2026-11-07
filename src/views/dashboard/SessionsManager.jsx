'use client';
import { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaTrashAlt, FaExternalLinkAlt, FaCheckCircle, FaArrowUp, FaArrowDown, FaSortAmountDown } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import { apiSecure, apiError } from '@/lib/api-client';
import { EVENT_TYPES } from '@/data/calendar';
import { cn } from '@/lib/utils';
import PageTitle from '@/components/dashboard/PageTitle';
import Modal from '@/components/dashboard/Modal';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { Input, Select } from '@/components/forms/FormField';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5]; // Saturday first, as in Bangladesh
const HOLIDAY_TYPES = ['holiday', 'vacation'].map((v) => ({ value: v, label: EVENT_TYPES[v].label }));
const EVENT_TYPE_OPTIONS = ['event', 'exam', 'meeting'].map((v) => ({ value: v, label: EVENT_TYPES[v].label }));
const KINDS = ['National', 'Religious', 'School'].map((v) => ({ value: v, label: v }));
const TABS = [
  { key: 'holidays', label: 'Holidays' },
  { key: 'events', label: 'Academic calendar' },
  { key: 'books', label: 'Book list' },
  { key: 'settings', label: 'Settings' },
];

const fieldBase = 'rounded-lg border border-line/20 bg-surface px-2.5 py-1.5 text-sm text-ink focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20';
const small = `w-full ${fieldBase}`;
const iconBtn = 'rounded-lg p-2 text-subtle hover:bg-line/10 hover:text-ink disabled:opacity-30';
const byDate = (a, b) => (a.date || '9999').localeCompare(b.date || '9999');
const editable = (s) => ({ label: s.label || '', weekend: s.weekend || [], confirmed: Boolean(s.confirmed), holidays: s.holidays || [], events: s.events || [], books: s.books || [] });

// ---------- Holidays & calendar rows ----------

function EntryTable({ rows, onChange, types, withKind, year, addLabel }) {
  const update = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const remove = (i) => onChange(rows.filter((_, j) => j !== i));
  const add = () => onChange([...rows, { date: `${year}-01-01`, end: '', title: '', type: types[0].value, kind: withKind ? 'National' : '', tentative: false }]);
  const cols = withKind ? 'lg:grid-cols-[150px_150px_minmax(0,1fr)_130px_120px_90px_40px]' : 'lg:grid-cols-[150px_150px_minmax(0,1fr)_170px_90px_40px]';

  return (
    <div>
      <div className={cn('hidden gap-2 px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-subtle lg:grid', cols)}>
        <span>Start date</span>
        <span>End date (if more than a day)</span>
        <span>Title</span>
        <span>Type</span>
        {withKind && <span>Kind</span>}
        <span>Tentative</span>
        <span />
      </div>
      {rows.length === 0 && <EmptyState title="Nothing added yet" description={`Use “${addLabel}” below.`} />}
      <ul className="space-y-2">
        {rows.map((row, i) => (
          <li key={i} className={cn('grid grid-cols-2 gap-2 rounded-xl border border-line/10 p-3 lg:items-center lg:border-0 lg:p-1', cols)}>
            <label className="block">
              <span className="mb-1 block text-xs text-subtle lg:hidden">Start date</span>
              <input type="date" className={small} value={row.date || ''} onChange={(e) => update(i, { date: e.target.value })} required aria-label="Start date" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-subtle lg:hidden">End date (optional)</span>
              <input type="date" className={small} value={row.end || ''} min={row.date} onChange={(e) => update(i, { end: e.target.value })} aria-label="End date" />
            </label>
            <label className="col-span-2 block lg:col-span-1">
              <span className="mb-1 block text-xs text-subtle lg:hidden">Title</span>
              <input className={small} value={row.title} onChange={(e) => update(i, { title: e.target.value })} maxLength={200} required placeholder="e.g. Victory Day" aria-label="Title" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-subtle lg:hidden">Type</span>
              <select className={small} value={row.type} onChange={(e) => update(i, { type: e.target.value })} aria-label="Type">
                {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
            {withKind && (
              <label className="block">
                <span className="mb-1 block text-xs text-subtle lg:hidden">Kind</span>
                <select className={small} value={row.kind || ''} onChange={(e) => update(i, { kind: e.target.value })} aria-label="Kind">
                  <option value="">—</option>
                  {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
              </label>
            )}
            <label className="flex items-center gap-2 text-sm text-body">
              <input type="checkbox" checked={Boolean(row.tentative)} onChange={(e) => update(i, { tentative: e.target.checked })} className="h-4 w-4 accent-primary-600" />
              <span className="lg:sr-only">Tentative</span>
            </label>
            <button type="button" onClick={() => remove(i)} className={cn(iconBtn, 'justify-self-end hover:bg-red-500/10 hover:text-red-600')} aria-label={`Delete ${row.title || 'row'}`}>
              <FaTrashAlt />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={add}>
          <FaPlus aria-hidden /> {addLabel}
        </Button>
        {rows.length > 1 && (
          <Button variant="ghost" size="sm" onClick={() => onChange([...rows].sort(byDate))}>
            <FaSortAmountDown aria-hidden /> Sort by date
          </Button>
        )}
      </div>
      <p className="mt-3 text-xs text-subtle">Tick “Tentative” for dates that depend on the moon or a Government notice — the website marks them as tentative.</p>
    </div>
  );
}

// ---------- Book list ----------

function BooksEditor({ levels, onChange }) {
  const setLevel = (li, patch) => onChange(levels.map((l, i) => (i === li ? { ...l, ...patch } : l)));
  const setClass = (li, ci, patch) => setLevel(li, { classes: levels[li].classes.map((c, i) => (i === ci ? { ...c, ...patch } : c)) });
  const setBooks = (li, ci, books) => setClass(li, ci, { books });
  const moveIn = (list, i, step) => {
    const next = [...list];
    [next[i], next[i + step]] = [next[i + step], next[i]];
    return next;
  };

  return (
    <div className="space-y-6">
      {levels.length === 0 && <EmptyState title="No book list yet" description="Add a group (e.g. Primary), then its classes and books." />}
      {levels.map((level, li) => (
        <div key={li} className="rounded-xl border border-line/15 p-4">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[220px] flex-1">
              <Input label="Group" name={`level-${li}`} value={level.level} onChange={(e) => setLevel(li, { level: e.target.value })} maxLength={120} placeholder="e.g. Primary" required />
            </div>
            <button type="button" className={iconBtn} disabled={li === 0} onClick={() => onChange(moveIn(levels, li, -1))} aria-label="Move group up"><FaArrowUp /></button>
            <button type="button" className={iconBtn} disabled={li === levels.length - 1} onClick={() => onChange(moveIn(levels, li, 1))} aria-label="Move group down"><FaArrowDown /></button>
            <button
              type="button"
              className={cn(iconBtn, 'hover:bg-red-500/10 hover:text-red-600')}
              onClick={() => window.confirm(`Delete “${level.level || 'this group'}” and all its classes?`) && onChange(levels.filter((_, i) => i !== li))}
              aria-label="Delete group"
            >
              <FaTrashAlt />
            </button>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {level.classes.map((cls, ci) => (
              <div key={ci} className="rounded-lg bg-line/5 p-3">
                <div className="flex items-center gap-2">
                  <input className={cn(fieldBase, 'min-w-0 flex-1 font-medium')} value={cls.name} onChange={(e) => setClass(li, ci, { name: e.target.value })} maxLength={120} placeholder="Class, e.g. Class III – V" required aria-label="Class name" />
                  <button
                    type="button"
                    className={cn(iconBtn, 'hover:bg-red-500/10 hover:text-red-600')}
                    onClick={() => window.confirm(`Delete “${cls.name || 'this class'}”?`) && setLevel(li, { classes: level.classes.filter((_, i) => i !== ci) })}
                    aria-label="Delete class"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
                <ol className="mt-3 space-y-1.5">
                  {cls.books.map((book, bi) => (
                    <li key={bi} className="flex items-center gap-1.5">
                      <span className="w-5 text-right text-xs text-faint">{bi + 1}.</span>
                      <input className={cn(fieldBase, 'min-w-0 flex-1')} value={book.title} onChange={(e) => setBooks(li, ci, cls.books.map((b, i) => (i === bi ? { ...b, title: e.target.value } : b)))} maxLength={200} placeholder="Book title" aria-label="Book title" />
                      <select className={cn(fieldBase, 'w-24 shrink-0')} value={book.source} onChange={(e) => setBooks(li, ci, cls.books.map((b, i) => (i === bi ? { ...b, source: e.target.value } : b)))} aria-label="Source">
                        <option value="NCTB">NCTB</option>
                        <option value="School">School</option>
                      </select>
                      <button type="button" className={cn(iconBtn, 'p-1.5')} disabled={bi === 0} onClick={() => setBooks(li, ci, moveIn(cls.books, bi, -1))} aria-label="Move book up"><FaArrowUp /></button>
                      <button type="button" className={cn(iconBtn, 'p-1.5 hover:bg-red-500/10 hover:text-red-600')} onClick={() => setBooks(li, ci, cls.books.filter((_, i) => i !== bi))} aria-label="Delete book"><FaTrashAlt /></button>
                    </li>
                  ))}
                </ol>
                <button type="button" onClick={() => setBooks(li, ci, [...cls.books, { title: '', source: 'NCTB' }])} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline">
                  <FaPlus aria-hidden /> Add book
                </button>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => setLevel(li, { classes: [...level.classes, { name: '', books: [{ title: '', source: 'NCTB' }] }] })}>
            <FaPlus aria-hidden /> Add class
          </Button>
        </div>
      ))}
      <Button variant="secondary" onClick={() => onChange([...levels, { level: '', classes: [{ name: '', books: [{ title: '', source: 'NCTB' }] }] }])}>
        <FaPlus aria-hidden /> Add group
      </Button>
      <p className="text-xs text-subtle">NCTB = Government textbook · School = selected by MA HAAD. Empty book rows are ignored when saving.</p>
    </div>
  );
}

// ---------- New session ----------

function NewSessionForm({ sessions, onClose, onCreated }) {
  const latest = sessions[0]?.year;
  const [year, setYear] = useState(String(latest ? latest + 1 : new Date().getFullYear() + 1));
  const [copyFrom, setCopyFrom] = useState(latest ? String(latest) : '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiSecure.post('/sessions', { year: Number(year), copyFrom: copyFrom ? Number(copyFrom) : undefined });
      onCreated(Number(year));
    } catch (err) {
      setError(apiError(err, 'Could not create the session.'));
      setSaving(false);
    }
  };

  return (
    <Modal
      title="New session"
      size="max-w-lg"
      onClose={onClose}
      onSubmit={submit}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create session'}</Button>
        </>
      }
    >
      <Alert type="error">{error}</Alert>
      <Input label="Year" name="year" type="number" min={2000} max={2100} value={year} onChange={(e) => setYear(e.target.value)} required />
      <Select
        label="Start from"
        name="copyFrom"
        value={copyFrom}
        onChange={(e) => setCopyFrom(e.target.value)}
        options={[{ value: '', label: 'An empty session' }, ...sessions.map((s) => ({ value: String(s.year), label: `A copy of ${s.label}` }))]}
      />
      <p className="text-sm text-muted">
        A copy keeps the holidays, calendar and book list, with every date moved to the new year. Check the dates afterwards — religious holidays change every
        year. The new session is not shown on the website until you make it current.
      </p>
    </Modal>
  );
}

// ---------- Page ----------

// Dashboard → Academic Sessions: holidays, academic calendar and book list for each school year
export default function SessionsManager() {
  const { data: sessions, loading, error, reload } = useApi('/sessions', { initialData: [], select: (res) => res.data || [] });
  const [year, setYear] = useState(null);
  const [doc, setDoc] = useState(null);
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState('holidays');
  const [flash, setFlash] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const dirty = useMemo(() => Boolean(doc && draft && JSON.stringify(editable(doc)) !== JSON.stringify(draft)), [doc, draft]);

  // The chosen session, or the one on the website (else the newest) until one is chosen
  const activeYear = year ?? (sessions.find((s) => s.current) || sessions[0])?.year ?? null;
  const ready = Boolean(doc && draft && doc.year === activeYear);

  useEffect(() => {
    if (activeYear === null) return undefined;
    let cancelled = false;
    apiSecure
      .get(`/sessions/${activeYear}`)
      .then((res) => {
        if (cancelled) return;
        setDoc(res.data.data);
        setDraft(editable(res.data.data));
      })
      .catch((err) => !cancelled && setFlash({ type: 'error', text: apiError(err, 'Could not open the session.') }));
    return () => {
      cancelled = true;
    };
  }, [activeYear]);

  const open = (target) => {
    setDoc(null);
    setDraft(null);
    setYear(target);
  };

  // Warn before leaving the page with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const switchTo = (target) => {
    if (target === activeYear) return;
    if (dirty && !window.confirm('You have unsaved changes. Leave this session without saving?')) return;
    setFlash({ type: '', text: '' });
    open(target);
  };

  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setFlash({ type: '', text: '' });
    const payload = { ...draft, holidays: [...draft.holidays].sort(byDate), events: [...draft.events].sort(byDate) };
    try {
      const res = await apiSecure.put(`/sessions/${activeYear}`, payload);
      setDoc(res.data.data);
      setDraft(editable(res.data.data));
      setFlash({ type: 'success', text: doc.current ? 'Saved — the website shows the changes now.' : 'Saved. This session is not on the website until you make it current (Settings).' });
      reload();
    } catch (err) {
      setFlash({ type: 'error', text: apiError(err, 'Could not save the session.') });
    } finally {
      setSaving(false);
    }
  };

  const makeCurrent = async () => {
    if (dirty) return setFlash({ type: 'error', text: 'Save your changes first.' });
    if (!window.confirm(`Show ${doc.label} on the website? The holidays, calendar and book list pages will switch to this session.`)) return;
    try {
      await apiSecure.post(`/sessions/${activeYear}/current`);
      setDoc((d) => ({ ...d, current: true }));
      setFlash({ type: 'success', text: `${doc.label} is now shown on the website.` });
      reload();
    } catch (err) {
      setFlash({ type: 'error', text: apiError(err, 'Could not change the session.') });
    }
  };

  const removeSession = async () => {
    if (!window.confirm(`Delete ${doc.label}? Its holidays, calendar and book list will be lost.`)) return;
    try {
      await apiSecure.delete(`/sessions/${activeYear}`);
      setYear(null);
      setDoc(null);
      setDraft(null);
      setFlash({ type: 'success', text: 'Session deleted.' });
      reload();
    } catch (err) {
      setFlash({ type: 'error', text: apiError(err, 'Could not delete the session.') });
    }
  };

  return (
    <div className="pb-24">
      <PageTitle
        title="Academic Sessions"
        description="Holidays, academic calendar and book list for each year. Create next year’s session from this year’s and update the dates."
        actions={
          <Button onClick={() => setCreating(true)}>
            <FaPlus aria-hidden /> New session
          </Button>
        }
      />

      <Alert type="error" className="mb-4">{error}</Alert>
      <Alert type={flash.type || 'success'} className="mb-4">{flash.text}</Alert>

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-line/10" />
      ) : sessions.length === 0 ? (
        <Card><EmptyState title="No sessions yet" description="Create a session to manage holidays, the academic calendar and the book list." /></Card>
      ) : (
        <>
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Sessions">
            {sessions.map((s) => (
              <button
                key={s.year}
                type="button"
                role="tab"
                aria-selected={activeYear === s.year}
                onClick={() => switchTo(s.year)}
                className={cn('inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm', activeYear === s.year ? 'bg-primary-600 text-white' : 'border border-line/15 bg-surface text-body hover:bg-line/5')}
              >
                {s.label}
                {s.current && <span className={cn('rounded-full px-1.5 text-[10px] font-bold uppercase', activeYear === s.year ? 'bg-white/25' : 'bg-green-500/15 text-green-700 dark:text-green-300')}>On website</span>}
              </button>
            ))}
          </div>

          {!ready ? (
            <div className="h-64 animate-pulse rounded-2xl bg-line/10" />
          ) : (
            <form onSubmit={save}>
              <Card className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/10 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-ink">{doc.label}</h2>
                    {doc.current ? <Badge color="green" className="normal-case">Shown on website</Badge> : <Badge color="gray" className="normal-case">Not on website</Badge>}
                    {!draft.confirmed && <Badge color="amber" className="normal-case">Tentative plan</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ['/campus/holidays', 'Holidays'],
                      ['/campus/academic-calendar', 'Calendar'],
                      ['/campus/books', 'Books'],
                    ].map(([href, label]) => (
                      <Button key={href} variant="secondary" size="sm" href={href} target="_blank">
                        <FaExternalLinkAlt aria-hidden /> {label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1 overflow-x-auto border-b border-line/10 px-3" role="tablist" aria-label="Session sections">
                  {TABS.map((t) => {
                    const count = t.key === 'holidays' ? draft.holidays.length : t.key === 'events' ? draft.events.length : t.key === 'books' ? draft.books.reduce((n, l) => n + l.classes.length, 0) : null;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        role="tab"
                        aria-selected={tab === t.key}
                        onClick={() => setTab(t.key)}
                        className={cn('-mb-px whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium', tab === t.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-muted hover:text-ink')}
                      >
                        {t.label}
                        {count !== null && <span className="ml-1.5 rounded-full bg-line/10 px-1.5 text-xs">{count}</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="p-5">
                  {tab === 'holidays' && <EntryTable rows={draft.holidays} onChange={set('holidays')} types={HOLIDAY_TYPES} withKind year={activeYear} addLabel="Add holiday" />}
                  {tab === 'events' && <EntryTable rows={draft.events} onChange={set('events')} types={EVENT_TYPE_OPTIONS} year={activeYear} addLabel="Add exam / event" />}
                  {tab === 'books' && <BooksEditor levels={draft.books} onChange={set('books')} />}
                  {tab === 'settings' && (
                    <div className="max-w-2xl space-y-6">
                      <Input label="Name shown on the website" name="label" value={draft.label} onChange={(e) => set('label')(e.target.value)} maxLength={60} placeholder={`Session ${activeYear}`} />
                      <fieldset>
                        <legend className="mb-2 text-sm font-medium text-body">Weekly holidays</legend>
                        <div className="flex flex-wrap gap-2">
                          {WEEK_ORDER.map((d) => (
                            <label key={d} className={cn('flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm', draft.weekend.includes(d) ? 'border-primary-500 bg-primary-500/10 text-ink' : 'border-line/15 text-body')}>
                              <input
                                type="checkbox"
                                className="h-4 w-4 accent-primary-600"
                                checked={draft.weekend.includes(d)}
                                onChange={(e) => set('weekend')(e.target.checked ? [...draft.weekend, d] : draft.weekend.filter((x) => x !== d))}
                              />
                              {DAYS[d]}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line/10 p-3">
                        <input type="checkbox" checked={draft.confirmed} onChange={(e) => set('confirmed')(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary-600" />
                        <span>
                          <span className="block text-sm font-medium text-ink">Dates are final</span>
                          <span className="block text-xs text-subtle">Leave unticked while the plan may change — the website then says the calendar is tentative.</span>
                        </span>
                      </label>

                      <div className="space-y-3 rounded-xl border border-line/10 p-4">
                        <p className="text-sm font-medium text-ink">Website</p>
                        {doc.current ? (
                          <p className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                            <FaCheckCircle aria-hidden /> This session is shown on the holidays, academic calendar and books pages.
                          </p>
                        ) : (
                          <div className="flex flex-wrap items-center gap-3">
                            <Button variant="secondary" onClick={makeCurrent}>
                              <FaCheckCircle aria-hidden /> Show this session on the website
                            </Button>
                            <Button variant="ghost" className="text-red-600 hover:bg-red-500/10" onClick={removeSession}>
                              <FaTrashAlt aria-hidden /> Delete session
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line/10 bg-surface/95 px-4 py-3 backdrop-blur lg:left-64">
                <div className="mx-auto flex max-w-6xl items-center justify-end gap-3">
                  <span className={cn('text-sm', dirty ? 'text-amber-600' : 'text-subtle')}>{dirty ? 'Unsaved changes' : 'All changes saved'}</span>
                  {dirty && (
                    <Button variant="secondary" onClick={() => setDraft(editable(doc))}>
                      Undo changes
                    </Button>
                  )}
                  <Button type="submit" disabled={saving || !dirty}>{saving ? 'Saving…' : 'Save session'}</Button>
                </div>
              </div>
            </form>
          )}
        </>
      )}

      {creating && (
        <NewSessionForm
          sessions={sessions}
          onClose={() => setCreating(false)}
          onCreated={async (created) => {
            setCreating(false);
            setFlash({ type: 'success', text: `Session ${created} created. Check the dates, then make it current under Settings when it is ready.` });
            await reload();
            if (dirty && !window.confirm('Open the new session? Unsaved changes in this one will be lost.')) return;
            open(created);
          }}
        />
      )}
    </div>
  );
}
