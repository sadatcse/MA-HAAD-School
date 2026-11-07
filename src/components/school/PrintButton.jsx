'use client';
import { FaPrint } from 'react-icons/fa';

export default function PrintButton({ label = 'Print', className = '' }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex items-center gap-2 rounded-full border border-brand-300 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 print:hidden ${className}`}
    >
      <FaPrint aria-hidden /> {label}
    </button>
  );
}
