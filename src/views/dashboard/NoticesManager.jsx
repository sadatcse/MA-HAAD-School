'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrashAlt, FaExternalLinkAlt, FaThumbtack, FaBullhorn } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import useApi from '@/hooks/useApi';
import { apiSecure, apiError } from '@/lib/api-client';
import { NOTICE_CATEGORY_OPTIONS, categoryStyle } from '@/lib/notices';
import { cn, formatDate, toDateInput } from '@/lib/utils';
import PageTitle from '@/components/dashboard/PageTitle';
import DataTable from '@/components/dashboard/DataTable';
import FilterBar from '@/components/dashboard/FilterBar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { Input, Textarea, Select } from '@/components/forms/FormField';
import ImageUpload from '@/components/dashboard/ImageUpload';

const today = () => toDateInput(new Date());
const EMPTY = { title: '', category: 'general', date: '', summary: '', body: '', image: '', attachmentUrl: '', status: 'published', inTicker: true, pinned: false };

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line/10 p-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary-600" />
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="block text-xs text-subtle">{hint}</span>}
      </span>
    </label>
  );
}

function NoticeForm({ initial, onClose, onSaved }) {
  const editing = Boolean(initial?._id);
  const [form, setForm] = useState(() =>
    editing ? { ...EMPTY, ...initial, date: toDateInput(initial.date) } : { ...EMPTY, date: today() }
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const onInput = (e) => set(e.target.name)(e.target.value);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      const res = editing ? await apiSecure.put(`/notices/${initial._id}`, payload) : await apiSecure.post('/notices', payload);
      onSaved(res.data?.message || 'Saved.');
    } catch (err) {
      setError(apiError(err, 'Could not save the notice.'));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={editing ? 'Edit notice' : 'New notice'}>
      <form onSubmit={submit} className="w-full max-w-2xl rounded-2xl border border-line/10 bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-line/10 px-5 py-4">
          <h2 className="text-lg">{editing ? 'Edit notice' : 'New notice'}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-subtle hover:bg-line/10" aria-label="Close">
            <HiX size={20} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <Alert type="error">{error}</Alert>
          <Input label="Title" name="title" value={form.title} onChange={onInput} maxLength={250} required autoFocus placeholder="e.g. Admission test schedule for session 2027" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Select label="Category" name="category" value={form.category} onChange={onInput} options={NOTICE_CATEGORY_OPTIONS} />
            <Input label="Notice date" name="date" type="date" value={form.date} onChange={onInput} required />
            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={onInput}
              options={[
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft (hidden)' },
              ]}
            />
          </div>
          <Textarea label="Short summary" name="summary" rows={2} value={form.summary} onChange={onInput} maxLength={500} placeholder="One or two lines shown on the notice cards" />
          <Textarea label="Full notice" name="body" rows={8} value={form.body} onChange={onInput} maxLength={20000} placeholder="Leave a blank line between paragraphs" />
          <ImageUpload label="Photo (optional)" value={form.image} folder="notices" aspect="aspect-video" onChange={(image) => setForm((f) => ({ ...f, image }))} hint="Shown on the notice card and page. JPG, PNG or WebP up to 8 MB." />
          <Input
            label="Attachment link (optional)"
            name="attachmentUrl"
            value={form.attachmentUrl}
            onChange={onInput}
            maxLength={1000}
            placeholder="https://drive.google.com/… or /files/notice.pdf"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle label="Show in the scrolling notice bar" hint="Under the main menu on every page" checked={form.inTicker} onChange={set('inTicker')} />
            <Toggle label="Pin to top" hint="Pinned notices are listed first" checked={form.pinned} onChange={set('pinned')} />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-line/10 px-5 py-4 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Publish notice'}</Button>
        </div>
      </form>
    </div>
  );
}

// Dashboard → Notices: everything on the public notice board and the scrolling bar
export default function NoticesManager() {
  const { data, loading, error, reload } = useApi('/notices?all=1', { initialData: [], select: (res) => (Array.isArray(res.data) ? res.data : res.data?.items || []) });
  const [editing, setEditing] = useState(null); // null = closed, {} = new, notice = edit
  const [flash, setFlash] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((n) => (!status || n.status === status) && (!category || n.category === category) && (!q || n.title.toLowerCase().includes(q)));
  }, [data, search, status, category]);

  const saved = (message) => {
    setEditing(null);
    setFlash(message);
    reload();
  };

  const remove = async (notice) => {
    if (!window.confirm(`Delete the notice “${notice.title}”? This cannot be undone.`)) return;
    try {
      await apiSecure.delete(`/notices/${notice._id}`);
      setFlash('Notice deleted.');
      reload();
    } catch (err) {
      setFlash('');
      window.alert(apiError(err, 'Could not delete the notice.'));
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Notice',
      render: (n) => (
        <div className="min-w-0 max-w-md">
          <p className="font-medium text-ink">
            {n.pinned && <FaThumbtack className="mr-1.5 inline text-xs text-amber-500" aria-label="Pinned" />}
            {n.title}
          </p>
          {n.summary && <p className="mt-0.5 line-clamp-1 text-xs text-subtle">{n.summary}</p>}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (n) => <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold', categoryStyle(n.category).className)}>{categoryStyle(n.category).label}</span>,
    },
    { key: 'date', header: 'Date', className: 'whitespace-nowrap', render: (n) => formatDate(n.date) },
    {
      key: 'status',
      header: 'Status',
      render: (n) => (
        <div className="flex flex-wrap gap-1">
          <Badge color={n.status === 'published' ? 'green' : 'gray'}>{n.status}</Badge>
          {n.inTicker && n.status === 'published' && <Badge color="amber">scrolling bar</Badge>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (n) => (
        <div className="flex justify-end gap-1">
          {n.status === 'published' && (
            <Link href={`/notices/${n._id}`} target="_blank" className="rounded-lg p-2 text-subtle hover:bg-line/10 hover:text-ink" aria-label="View on website">
              <FaExternalLinkAlt />
            </Link>
          )}
          <button type="button" onClick={() => setEditing(n)} className="rounded-lg p-2 text-subtle hover:bg-line/10 hover:text-primary-600" aria-label="Edit">
            <FaEdit />
          </button>
          <button type="button" onClick={() => remove(n)} className="rounded-lg p-2 text-subtle hover:bg-red-500/10 hover:text-red-600" aria-label="Delete">
            <FaTrashAlt />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageTitle
        title="Notices"
        description="Notices appear on the Notice Board, the home page and (optionally) the scrolling bar under the menu."
        actions={
          <Button onClick={() => setEditing({})}>
            <FaPlus aria-hidden /> New notice
          </Button>
        }
      />

      <Alert type="success" className="mb-4">{flash}</Alert>
      <Alert type="error" className="mb-4">{error}</Alert>

      <Card className="p-0">
        <FilterBar
          search={search}
          onSearch={setSearch}
          placeholder="Search by title…"
          filters={[
            { key: 'status', value: status, onChange: setStatus, options: [{ value: '', label: 'All statuses' }, { value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }] },
            { key: 'category', value: category, onChange: setCategory, options: [{ value: '', label: 'All categories' }, ...NOTICE_CATEGORY_OPTIONS] },
          ]}
        />
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          emptyTitle={data.length ? 'No notices match the filters' : 'No notices yet'}
          emptyDescription={data.length ? undefined : 'Publish your first notice — it will show on the website straight away.'}
        />
      </Card>

      {!loading && data.length === 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-line/10 bg-surface p-4 text-sm text-muted">
          <FaBullhorn className="shrink-0 text-primary-500" aria-hidden />
          Until a notice is published, the scrolling bar shows the school’s welcome and admission-enquiry messages.
        </div>
      )}

      {editing && <NoticeForm initial={editing} onClose={() => setEditing(null)} onSaved={saved} />}
    </div>
  );
}
