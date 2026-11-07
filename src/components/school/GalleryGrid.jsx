'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaSearchPlus } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';

function Lightbox({ items, index, onClose, onMove }) {
  const item = items[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onMove(-1);
      if (e.key === 'ArrowRight') onMove(1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onMove]);

  return (
    <div className="fixed inset-0 z-[60] flex animate-fade-in items-center justify-center bg-navy-950/95 p-4" role="dialog" aria-modal="true" aria-label={item.title}>
      <button type="button" className="absolute inset-0 cursor-zoom-out" onClick={onClose} aria-label="Close" />
      <figure className="relative z-10 flex max-h-full w-full max-w-5xl flex-col items-center">
        <div className="relative h-[70vh] w-full">
          <Image src={item.src} alt={item.title} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-contain" />
        </div>
        <figcaption className="mt-4 text-center text-white">
          <span className="font-display text-lg">{item.title}</span>
          <span className="ml-3 rounded-full bg-gold-400 px-2.5 py-0.5 text-[10px] font-bold uppercase text-navy-950">{item.category}</span>
          <p className="mt-1 text-xs text-white/50">{index + 1} / {items.length}</p>
        </figcaption>
      </figure>
      <button type="button" onClick={onClose} className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
        <HiX size={22} />
      </button>
      {items.length > 1 && (
        <>
          <button type="button" onClick={() => onMove(-1)} className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-gold-400 hover:text-navy-950" aria-label="Previous photo">
            <FaChevronLeft aria-hidden />
          </button>
          <button type="button" onClick={() => onMove(1)} className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-gold-400 hover:text-navy-950" aria-label="Next photo">
            <FaChevronRight aria-hidden />
          </button>
        </>
      )}
    </div>
  );
}

// Photo grid with category filter and a full-screen viewer
export default function GalleryGrid({ items, categories = [], limit }) {
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(null);

  const shown = useMemo(() => {
    const list = category === 'All' ? items : items.filter((i) => i.category === category);
    return limit ? list.slice(0, limit) : list;
  }, [items, category, limit]);

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((step) => setOpen((i) => (i === null ? i : (i + step + shown.length) % shown.length)), [shown.length]);

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter photos">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                category === c ? 'bg-navy-900 text-white shadow-md' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 md:grid-cols-3 lg:auto-rows-[230px]">
        {shown.map((item, i) => (
          <li key={item._id || item.src} className={cn(i % 7 === 0 && 'col-span-2 row-span-2')}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block h-full w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm"
              aria-label={`Open photo: ${item.title || i + 1}`}
            >
              <Image
                src={item.src}
                alt={item.title || 'School photo'}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy-950/60 p-3 text-center text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-400 text-navy-950"><FaSearchPlus aria-hidden /></span>
                <span className="font-display text-sm sm:text-base">{item.title}</span>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">{item.category}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && shown[open] && <Lightbox items={shown} index={open} onClose={close} onMove={move} />}
    </>
  );
}
