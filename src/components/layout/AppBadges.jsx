import { FaApple } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

// Four-colour Google Play triangle
function GooglePlayLogo({ className }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <path fill="#00D7FE" d="M48 36.5c-5 5.3-8 13.5-8 24v391c0 10.5 3 18.7 8 24l2 2L269 258.7v-5.4L50 34.5l-2 2Z" />
      <path fill="#FFCE00" d="m342 331.7-73-73v-5.4l73-73 1.7 1 86.5 49.1c24.7 14 24.7 37 0 51l-86.5 49.2-1.7 1.1Z" />
      <path fill="#FF3A44" d="M343.7 330.6 269 256 48 477c8.2 8.7 21.7 9.7 36.9 1.1l258.8-147.5" />
      <path fill="#00F076" d="M343.7 181.4 84.9 34c-15.2-8.7-28.7-7.6-36.9 1.1L269 256l74.7-74.6Z" />
    </svg>
  );
}

const STORES = [
  { key: 'appStore', label: 'App Store', small: 'Available on the', Icon: FaApple, iconClass: 'text-[28px] text-white' },
  { key: 'googlePlay', label: 'Google Play', small: 'GET IT ON', Icon: GooglePlayLogo, iconClass: 'h-7 w-7' },
];

// "Available on the App Store" / "Get it on Google Play" badges.
// They link to the stores once the URLs are set in siteConfig.apps.
export default function AppBadges({ className }) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)} aria-label="Get our app">
      {STORES.map(({ key, label, small, Icon, iconClass }) => {
        const url = siteConfig.apps?.[key];
        const body = (
          <>
            <Icon className={cn('shrink-0', iconClass)} />
            <span className="flex flex-col leading-none">
              <span className={cn('text-[10px] text-white/85', small === small.toUpperCase() && 'tracking-wide')}>{small}</span>
              <span className="mt-1 text-[18px] font-semibold tracking-tight text-white">{label}</span>
            </span>
          </>
        );
        const classes = 'inline-flex h-[52px] w-[184px] items-center gap-3 whitespace-nowrap rounded-xl border border-white/30 bg-black px-4 transition';
        return url ? (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${small} ${label}`}
            className={cn(classes, 'hover:border-gold-400 hover:shadow-lg hover:shadow-black/30')}
          >
            {body}
          </a>
        ) : (
          <span key={key} className={cn(classes, 'cursor-default')} title="Coming soon" aria-label={`${label} app — coming soon`}>
            {body}
          </span>
        );
      })}
    </div>
  );
}
