import { siteConfig } from '@/config/site';

export default function manifest() {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: siteConfig.themeColor,
    icons: [
      { src: '/logos/ma-haad-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/logos/ma-haad-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
