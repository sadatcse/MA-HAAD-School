'use client';
import { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaTrashAlt, FaImage } from 'react-icons/fa';
import { uploadImage, IMAGE_ACCEPT } from '@/lib/upload';
import { cn } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';

/**
 * Photo picker: uploads the chosen file straight away and reports the new link.
 *   <ImageUpload value={form.photo} folder="staff" onChange={(url, info) => …} />
 */
export default function ImageUpload({ value, onChange, folder = 'misc', label = 'Photo', aspect = 'aspect-[4/3]', hint, allowRemove = true }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const info = await uploadImage(file, folder);
      onChange(info.url, info);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {label && <p className="mb-1 block text-sm font-medium text-body">{label}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className={cn('relative w-full max-w-[220px] overflow-hidden rounded-xl border border-line/15 bg-line/5', aspect)}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- preview of a just-uploaded file
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl text-faint">
              <FaImage aria-hidden />
            </span>
          )}
          {busy && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
              <Spinner className="py-0" />
            </span>
          )}
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-line/20 bg-surface px-3 py-2 text-sm font-medium text-body hover:bg-line/5 disabled:opacity-60"
          >
            <FaCloudUploadAlt aria-hidden /> {busy ? 'Uploading…' : value ? 'Change photo' : 'Upload photo'}
          </button>
          {value && allowRemove && (
            <button type="button" onClick={() => onChange('', null)} disabled={busy} className="flex items-center gap-2 text-sm text-red-600 hover:underline">
              <FaTrashAlt aria-hidden /> Remove photo
            </button>
          )}
          <p className="text-xs text-subtle">{hint || 'JPG, PNG or WebP, up to 8 MB. Large photos are resized automatically.'}</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input ref={input} type="file" accept={IMAGE_ACCEPT} className="hidden" onChange={pick} />
    </div>
  );
}
