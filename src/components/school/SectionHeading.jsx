import { cn } from '@/lib/utils';

// Gold pill label + serif title + optional subtitle (as in the reference design)
export function Kicker({ children, className, light = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em]',
        light ? 'bg-white/10 text-gold-300 ring-1 ring-white/15' : 'bg-gold-100 text-gold-700',
        className
      )}
    >
      <span className={cn('h-px w-3', light ? 'bg-gold-300' : 'bg-gold-600')} aria-hidden />
      {children}
    </span>
  );
}

export default function SectionHeading({ kicker, title, subtitle, align = 'center', light = false, className, as: Tag = 'h2' }) {
  const center = align === 'center';
  return (
    <div className={cn(center && 'mx-auto max-w-2xl text-center', className)}>
      {kicker && <Kicker light={light}>{kicker}</Kicker>}
      <Tag className={cn('mt-4 text-balance font-display text-3xl leading-tight md:text-4xl', light ? 'text-white' : 'text-navy-900')}>{title}</Tag>
      {subtitle && <p className={cn('mt-3 leading-relaxed', light ? 'text-white/75' : 'text-slate-500')}>{subtitle}</p>}
    </div>
  );
}
