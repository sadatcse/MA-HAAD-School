import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

// School logo (shield + name). `size` sets the height; the width follows the logo's 1200×370 ratio.
// variant="card" puts it on a white rounded card for dark backgrounds (footer).
const SIZES = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-12 sm:h-14 lg:h-16',
};

export default function Logo({ size = 'md', variant, className = '', preload = false }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — home`}
      className={cn('inline-flex shrink-0 items-center', variant === 'card' && 'rounded-xl bg-white px-3 py-2 shadow-sm', className)}
    >
      <Image
        src={siteConfig.logo}
        alt={siteConfig.name}
        width={1200}
        height={370}
        preload={preload}
        sizes="(min-width: 1024px) 220px, 180px"
        className={cn('w-auto', SIZES[size] || size)}
      />
    </Link>
  );
}
