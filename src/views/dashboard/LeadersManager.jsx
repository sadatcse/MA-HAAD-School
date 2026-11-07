'use client';
import { useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import { apiSecure, apiError } from '@/lib/api-client';
import PageTitle from '@/components/dashboard/PageTitle';
import ImageUpload from '@/components/dashboard/ImageUpload';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { Input, Textarea } from '@/components/forms/FormField';

const FIELDS = ['name', 'role', 'photo', 'heading', 'excerpt', 'body'];
const pick = (m) => Object.fromEntries(FIELDS.map((k) => [k, m?.[k] || '']));

function LeaderForm({ slug, message }) {
  const [form, setForm] = useState(() => pick(message));
  const [saved, setSaved] = useState(() => pick(message));
  const [status, setStatus] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const dirty = FIELDS.some((k) => form[k] !== saved[k]);
  const id = (name) => `${slug}-${name}`;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', text: '' });
    try {
      const res = await apiSecure.put(`/leaders/${slug}`, form);
      const next = pick(res.data.data);
      setForm(next);
      setSaved(next);
      setStatus({ type: 'success', text: 'Saved — the website now shows this message.' });
    } catch (err) {
      setStatus({ type: 'error', text: apiError(err, 'Could not save.') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">{message.label}</h2>
          <Button variant="secondary" size="sm" href={`/about/${slug}`} target="_blank">
            <FaExternalLinkAlt aria-hidden /> View page
          </Button>
        </div>
        <Alert type={status.type || 'success'}>{status.text}</Alert>

        <ImageUpload value={form.photo} folder="leaders" aspect="aspect-[5/6]" onChange={(photo) => setForm((f) => ({ ...f, photo }))} hint="A portrait (head and shoulders) photo looks best." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" name={id('name')} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} maxLength={120} placeholder="e.g. Md. Rafiqul Islam" />
          <Input label="Title" name={id('role')} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} maxLength={120} placeholder={message.role} />
        </div>
        <Input label="Heading" name={id('heading')} value={form.heading} onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))} maxLength={200} placeholder={`e.g. ${message.heading}`} />
        <Textarea label="Short quote" name={id('excerpt')} rows={3} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} maxLength={600} placeholder="Two or three lines used in search results and previews" />
        <Textarea
          label="Message"
          name={id('body')}
          rows={14}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          maxLength={20000}
          required
          placeholder="Leave a blank line between paragraphs"
        />
        <p className="text-xs text-subtle">Leave an empty line between paragraphs. The name and title are shown under the photo and in the sign-off.</p>

        <div className="flex items-center justify-end gap-3 border-t border-line/10 pt-4">
          {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
          <Button type="submit" disabled={saving || !dirty}>{saving ? 'Saving…' : 'Save message'}</Button>
        </div>
      </form>
    </Card>
  );
}

// Dashboard → CEO & Principal: name, photo and message on /about/ceo-message and /about/principal-message
export default function LeadersManager() {
  const { data, loading, error } = useApi('/leaders', { initialData: null, select: (res) => res.data });

  return (
    <div>
      <PageTitle title="CEO & Principal" description="Update the name, photo and message when the CEO or Principal changes." />
      <Alert type="error" className="mb-4">{error}</Alert>
      {loading || !data ? (
        <div className="grid gap-6 xl:grid-cols-2">{[0, 1].map((i) => <div key={i} className="h-[640px] animate-pulse rounded-2xl bg-line/10" />)}</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {Object.entries(data).map(([slug, message]) => <LeaderForm key={slug} slug={slug} message={message} />)}
        </div>
      )}
    </div>
  );
}
