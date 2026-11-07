'use client';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { FaCloudUploadAlt, FaEdit, FaTrashAlt, FaArrowLeft, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import { apiSecure, apiError } from '@/lib/api-client';
import { uploadImage, IMAGE_ACCEPT } from '@/lib/upload';
import { cn } from '@/lib/utils';
import PageTitle from '@/components/dashboard/PageTitle';
import Modal from '@/components/dashboard/Modal';
import ImageUpload from '@/components/dashboard/ImageUpload';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { Input } from '@/components/forms/FormField';

const DEFAULT_CATEGORIES = ['Annual Sports', 'Cultural', 'Academic', 'Campus Life'];
const titleFromFile = (name) => name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);

// Text box with the existing categories as suggestions
function CategoryInput({ value, onChange, categories, id }) {
  return (
    <>
      <Input label="Category" name={id} value={value} onChange={(e) => onChange(e.target.value)} list={`${id}-list`} maxLength={60} placeholder="e.g. Annual Sports" />
      <datalist id={`${id}-list`}>
        {categories.map((c) => <option key={c} value={c} />)}
      </datalist>
    </>
  );
}

function PhotoForm({ photo, categories, onClose, onSaved }) {
  const [form, setForm] = useState({ src: photo.src, width: photo.width, height: photo.height, title: photo.title, category: photo.category });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.src) return setError('Upload a photo first.');
    setSaving(true);
    setError('');
    try {
      await apiSecure.put(`/gallery/${photo._id}`, form);
      onSaved('Photo saved.');
    } catch (err) {
      setError(apiError(err, 'Could not save the photo.'));
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Edit photo"
      onClose={onClose}
      onSubmit={submit}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </>
      }
    >
      <Alert type="error">{error}</Alert>
      <ImageUpload
        value={form.src}
        folder="gallery"
        allowRemove={false}
        onChange={(src, info) => setForm((f) => ({ ...f, src, width: info?.width || 0, height: info?.height || 0 }))}
      />
      <Input label="Caption" name="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} maxLength={200} placeholder="e.g. Annual Sports Day 2027" />
      <CategoryInput id="edit-category" value={form.category} onChange={(category) => setForm((f) => ({ ...f, category }))} categories={categories} />
    </Modal>
  );
}

// Dashboard → Photo Gallery: upload, caption, sort and delete the photos on /gallery and the home page
export default function GalleryManager() {
  const { data: photos, setData, loading, error, reload } = useApi('/gallery', { initialData: [], select: (res) => res.data || [] });
  const [flash, setFlash] = useState('');
  const [failure, setFailure] = useState('');
  const [filter, setFilter] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Campus Life');
  const [progress, setProgress] = useState(null); // { done, total }
  const [editing, setEditing] = useState(null);
  const fileInput = useRef(null);

  const categories = useMemo(() => [...new Set([...DEFAULT_CATEGORIES, ...photos.map((p) => p.category).filter(Boolean)])], [photos]);
  const shown = filter ? photos.filter((p) => p.category === filter) : photos;

  const notify = (message) => {
    setFailure('');
    setFlash(message);
  };

  const uploadFiles = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    if (!files.length) return;
    setFlash('');
    setFailure('');
    const failed = [];
    setProgress({ done: 0, total: files.length });
    // Upload in reverse so the first chosen file ends up first in the gallery
    for (const [i, file] of [...files].reverse().entries()) {
      try {
        const info = await uploadImage(file, 'gallery');
        await apiSecure.post('/gallery', { src: info.url, width: info.width, height: info.height, title: titleFromFile(file.name), category: uploadCategory.trim() || 'Campus Life' });
      } catch (err) {
        failed.push(`${file.name}: ${err.message || apiError(err)}`);
      }
      setProgress({ done: i + 1, total: files.length });
    }
    setProgress(null);
    await reload();
    const added = files.length - failed.length;
    if (added) setFlash(`${added} photo${added === 1 ? '' : 's'} added to the gallery.`);
    if (failed.length) setFailure(`Not uploaded — ${failed.join(' · ')}`);
  };

  const move = async (photo, step) => {
    const ids = photos.map((p) => p._id);
    const from = ids.indexOf(photo._id);
    // Move past the next photo that is visible with the current filter
    let to = from + step;
    while (filter && to >= 0 && to < photos.length && photos[to].category !== filter) to += step;
    if (to < 0 || to >= photos.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    const previous = photos;
    setData(ids.map((id) => photos.find((p) => p._id === id)));
    try {
      await apiSecure.put('/gallery/order', { ids });
    } catch (err) {
      setData(previous);
      setFailure(apiError(err, 'Could not save the new order.'));
    }
  };

  const remove = async (photo) => {
    if (!window.confirm(`Delete this photo${photo.title ? ` (“${photo.title}”)` : ''}? It will be removed from the website.`)) return;
    try {
      await apiSecure.delete(`/gallery/${photo._id}`);
      notify('Photo deleted.');
      reload();
    } catch (err) {
      setFailure(apiError(err, 'Could not delete the photo.'));
    }
  };

  return (
    <div>
      <PageTitle
        title="Photo Gallery"
        description="Photos shown on the Photo Gallery page. The first six also appear on the home page."
        actions={
          <Button href="/gallery" target="_blank" variant="secondary">
            <FaExternalLinkAlt aria-hidden /> View gallery
          </Button>
        }
      />

      <Alert type="success" className="mb-4">{flash}</Alert>
      <Alert type="error" className="mb-4">{failure || error}</Alert>

      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <CategoryInput id="upload-category" value={uploadCategory} onChange={setUploadCategory} categories={categories} />
          <Button onClick={() => fileInput.current?.click()} disabled={Boolean(progress)}>
            <FaCloudUploadAlt aria-hidden /> {progress ? `Uploading ${progress.done} of ${progress.total}…` : 'Upload photos'}
          </Button>
        </div>
        <p className="mt-2 text-xs text-subtle">You can choose several photos at once. JPG, PNG or WebP up to 8 MB each — they are resized automatically.</p>
        <input ref={fileInput} type="file" accept={IMAGE_ACCEPT} multiple className="hidden" onChange={uploadFiles} />
      </Card>

      {photos.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {['', ...new Set(photos.map((p) => p.category))].map((c) => (
            <button
              key={c || 'all'}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={cn('rounded-full px-3 py-1.5 text-sm', filter === c ? 'bg-primary-600 text-white' : 'border border-line/15 bg-surface text-body hover:bg-line/5')}
            >
              {c || 'All'} <span className="opacity-70">({c ? photos.filter((p) => p.category === c).length : photos.length})</span>
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => <li key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-line/10" />)}
        </ul>
      ) : shown.length === 0 ? (
        <Card><EmptyState title={photos.length ? 'No photos in this category' : 'No photos yet'} description="Upload photos above — they appear on the website straight away." /></Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((photo, i) => (
            <li key={photo._id} className="overflow-hidden rounded-xl border border-line/10 bg-surface shadow-sm">
              <div className="relative aspect-[4/3] bg-line/5">
                {/* eslint-disable-next-line @next/next/no-img-element -- dashboard thumbnail */}
                <img src={photo.src} alt={photo.title} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">{i + 1}</span>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-ink" title={photo.title}>{photo.title || <span className="text-faint">No caption</span>}</p>
                <p className="text-xs text-subtle">{photo.category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(photo, -1)} disabled={i === 0} className="rounded-lg p-2 text-subtle hover:bg-line/10 hover:text-ink disabled:opacity-30" aria-label="Move earlier">
                      <FaArrowLeft />
                    </button>
                    <button type="button" onClick={() => move(photo, 1)} disabled={i === shown.length - 1} className="rounded-lg p-2 text-subtle hover:bg-line/10 hover:text-ink disabled:opacity-30" aria-label="Move later">
                      <FaArrowRight />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setEditing(photo)} className="rounded-lg p-2 text-subtle hover:bg-line/10 hover:text-primary-600" aria-label="Edit">
                      <FaEdit />
                    </button>
                    <button type="button" onClick={() => remove(photo)} className="rounded-lg p-2 text-subtle hover:bg-red-500/10 hover:text-red-600" aria-label="Delete">
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {photos.length > 0 && (
        <p className="mt-6 text-sm text-muted">
          Tip: use the arrows to change the order. The first six photos are shown on the <Link href="/" target="_blank" className="text-primary-600 hover:underline">home page</Link>.
        </p>
      )}

      {editing && (
        <PhotoForm
          photo={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            notify(message);
            reload();
          }}
        />
      )}
    </div>
  );
}
