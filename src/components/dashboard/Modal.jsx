'use client';
import { useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';

// Dialog used by the dashboard editors. Pass onSubmit to render it as a <form>.
export default function Modal({ title, onClose, onSubmit, children, footer, size = 'max-w-2xl' }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const Tag = onSubmit ? 'form' : 'div';
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={title}>
      <Tag onSubmit={onSubmit} className={cn('w-full rounded-2xl border border-line/10 bg-surface shadow-2xl', size)}>
        <div className="flex items-center justify-between border-b border-line/10 px-5 py-4">
          <h2 className="text-lg">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-subtle hover:bg-line/10" aria-label="Close">
            <HiX size={20} />
          </button>
        </div>
        <div className="space-y-4 p-5">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-line/10 px-5 py-4 sm:flex-row sm:justify-end">{footer}</div>}
      </Tag>
    </div>
  );
}
