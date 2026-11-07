'use client';
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrashAlt, FaArrowUp, FaArrowDown, FaExternalLinkAlt, FaUserTie } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import { apiSecure, apiError } from '@/lib/api-client';
import { staffGroups } from '@/data/staff';
import { cn } from '@/lib/utils';
import PageTitle from '@/components/dashboard/PageTitle';
import Modal from '@/components/dashboard/Modal';
import ImageUpload from '@/components/dashboard/ImageUpload';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { Input, Select } from '@/components/forms/FormField';

const GROUP_OPTIONS = staffGroups.map((g) => ({ value: g.slug, label: g.title }));
const EMPTY = { name: '', designation: '', subject: '', qualification: '', photo: '' };

function MemberForm({ member, group, onClose, onSaved }) {
  const editing = Boolean(member._id);
  const [form, setForm] = useState({ ...EMPTY, group, ...member });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const onInput = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const isTeacher = form.group.endsWith('teachers');

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { group: form.group, name: form.name, designation: form.designation, subject: form.subject, qualification: form.qualification, photo: form.photo };
    try {
      const res = editing ? await apiSecure.put(`/staff/${member._id}`, payload) : await apiSecure.post('/staff', payload);
      onSaved(res.data?.message || 'Saved.', form.group);
    } catch (err) {
      setError(apiError(err, 'Could not save.'));
      setSaving(false);
    }
  };

  return (
    <Modal
      title={editing ? `Edit ${member.name}` : 'Add a person'}
      onClose={onClose}
      onSubmit={submit}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add'}</Button>
        </>
      }
    >
      <Alert type="error">{error}</Alert>
      <ImageUpload value={form.photo} folder="staff" aspect="aspect-square" onChange={(photo) => setForm((f) => ({ ...f, photo }))} hint="A square head-and-shoulders photo looks best. Without a photo, an icon is shown." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" name="name" value={form.name} onChange={onInput} maxLength={120} required autoFocus placeholder="e.g. Md. Abdul Karim" />
        <Select label="List" name="group" value={form.group} onChange={onInput} options={GROUP_OPTIONS} />
        <Input label="Designation" name="designation" value={form.designation} onChange={onInput} maxLength={120} placeholder={isTeacher ? 'e.g. Assistant Teacher' : 'e.g. Chairman'} />
        <Input label={isTeacher ? 'Subject' : 'Role / responsibility (optional)'} name="subject" value={form.subject} onChange={onInput} maxLength={120} placeholder={isTeacher ? 'e.g. English' : ''} />
      </div>
      <Input label="Qualification (optional)" name="qualification" value={form.qualification} onChange={onInput} maxLength={200} placeholder="e.g. M.A. (English), B.Ed." />
    </Modal>
  );
}

// Dashboard → Teachers & Staff: the people on the five Administration pages
export default function StaffManager() {
  const { data: people, setData, loading, error, reload } = useApi('/staff', { initialData: [], select: (res) => res.data || [] });
  const [group, setGroup] = useState(staffGroups[0].slug);
  const [editing, setEditing] = useState(null);
  const [flash, setFlash] = useState('');
  const [failure, setFailure] = useState('');

  const current = staffGroups.find((g) => g.slug === group);
  const list = people.filter((p) => p.group === group);

  const move = async (person, step) => {
    const ids = list.map((p) => p._id);
    const from = ids.indexOf(person._id);
    const to = from + step;
    if (to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    const previous = people;
    const reordered = ids.map((id) => list.find((p) => p._id === id));
    setData([...people.filter((p) => p.group !== group), ...reordered]);
    try {
      await apiSecure.put('/staff/order', { group, ids });
    } catch (err) {
      setData(previous);
      setFailure(apiError(err, 'Could not save the new order.'));
    }
  };

  const remove = async (person) => {
    if (!window.confirm(`Remove ${person.name} from “${current.title}”?`)) return;
    try {
      await apiSecure.delete(`/staff/${person._id}`);
      setFailure('');
      setFlash(`${person.name} removed.`);
      reload();
    } catch (err) {
      setFailure(apiError(err, 'Could not remove.'));
    }
  };

  return (
    <div>
      <PageTitle
        title="Teachers & Staff"
        description="The Board of Trustees, management and teachers shown on the Administration pages."
        actions={
          <Button onClick={() => setEditing({})}>
            <FaPlus aria-hidden /> Add person
          </Button>
        }
      />

      <Alert type="success" className="mb-4">{flash}</Alert>
      <Alert type="error" className="mb-4">{failure || error}</Alert>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Lists">
        {staffGroups.map((g) => {
          const count = people.filter((p) => p.group === g.slug).length;
          return (
            <button
              key={g.slug}
              type="button"
              role="tab"
              aria-selected={group === g.slug}
              onClick={() => setGroup(g.slug)}
              className={cn('whitespace-nowrap rounded-full px-4 py-2 text-sm', group === g.slug ? 'bg-primary-600 text-white' : 'border border-line/15 bg-surface text-body hover:bg-line/5')}
            >
              {g.title} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <Card className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/10 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink">{current.title}</h2>
            <p className="text-xs text-subtle">Shown in this order on the website.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" href={`/administration/${group}`} target="_blank">
              <FaExternalLinkAlt aria-hidden /> View page
            </Button>
            <Button size="sm" onClick={() => setEditing({})}>
              <FaPlus aria-hidden /> Add
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-line/10" />)}</div>
        ) : list.length === 0 ? (
          <EmptyState title="Nobody added yet" description="Until someone is added, the page shows “This list is being updated”." />
        ) : (
          <ul className="divide-y divide-line/5">
            {list.map((person, i) => (
              <li key={person._id} className="flex items-center gap-4 px-5 py-3">
                <span className="w-5 text-xs font-semibold text-faint">{i + 1}</span>
                {person.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- dashboard thumbnail
                  <img src={person.photo} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover object-top" />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-line/10 text-faint"><FaUserTie aria-hidden /></span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{person.name}</p>
                  <p className="truncate text-xs text-subtle">{[person.designation, person.subject, person.qualification].filter(Boolean).join(' · ') || '—'}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => move(person, -1)} disabled={i === 0} className="rounded-lg p-2 text-subtle hover:bg-line/10 hover:text-ink disabled:opacity-30" aria-label="Move up">
                    <FaArrowUp />
                  </button>
                  <button type="button" onClick={() => move(person, 1)} disabled={i === list.length - 1} className="rounded-lg p-2 text-subtle hover:bg-line/10 hover:text-ink disabled:opacity-30" aria-label="Move down">
                    <FaArrowDown />
                  </button>
                  <button type="button" onClick={() => setEditing(person)} className="rounded-lg p-2 text-subtle hover:bg-line/10 hover:text-primary-600" aria-label={`Edit ${person.name}`}>
                    <FaEdit />
                  </button>
                  <button type="button" onClick={() => remove(person)} className="rounded-lg p-2 text-subtle hover:bg-red-500/10 hover:text-red-600" aria-label={`Remove ${person.name}`}>
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {editing && (
        <MemberForm
          member={editing}
          group={group}
          onClose={() => setEditing(null)}
          onSaved={(message, savedGroup) => {
            setEditing(null);
            setFailure('');
            setFlash(message);
            setGroup(savedGroup);
            reload();
          }}
        />
      )}
    </div>
  );
}
