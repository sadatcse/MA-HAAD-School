import { Playfair_Display, Poppins } from 'next/font/google';
import '@/styles/globals.css';
import AppShell from '@/components/layout/AppShell';
import { siteConfig } from '@/config/site';
import { getCachedSetting } from '@/server/services/settings.service';
import { tickerNotices } from '@/server/services/notice.service';
import { DEFAULT_TIME_ZONE, setTimeZone } from '@/lib/timezone';

const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const sans = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  // Home page: "MA HAAD School & College — Inspiring Young Minds…"; other pages: "Page | MA HAAD School & College"
  title: {
    default: `${siteConfig.name} — ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ['MA HAAD School', 'MA HAAD School & College', 'English Version school Dhaka', 'school in Khilkhet', 'National Curriculum', 'Play Group to Class X'],
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.slogan}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: '/images/school/sports-march-past.jpg', width: 900, height: 598, alt: siteConfig.name }],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport = {
  themeColor: siteConfig.themeColor,
};

// Every page reads the site timezone and the notice bar per request
export const dynamic = 'force-dynamic';

// Dashboard and login: applies the saved theme (or the system preference) before first paint.
// The public website always stays light.
const THEME_SCRIPT = `(function(){try{var p=location.pathname;var app=p.indexOf('/dashboard')===0||p.indexOf('/login')===0;var t=localStorage.getItem('theme');var d=app&&(t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

async function readTimeZone() {
  try {
    return (await getCachedSetting('site')).timezone; // cached 60 s — keeps first paint fast
  } catch {
    return DEFAULT_TIME_ZONE; // database unreachable — pages still render
  }
}

async function readTicker() {
  try {
    return await tickerNotices(); // cached 60 s
  } catch {
    return []; // database unreachable — the bar shows the welcome messages
  }
}

export default async function RootLayout({ children }) {
  const [timeZone, notices] = await Promise.all([readTimeZone(), readTicker()]);
  setTimeZone(timeZone);

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <AppShell timeZone={timeZone} notices={notices}>{children}</AppShell>
      </body>
    </html>
  );
}
