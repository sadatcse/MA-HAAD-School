import { siteConfig } from '@/config/site';
import { allPublicLinks } from '@/config/navigation';

// Login portals are left out — they are not useful in search results
const SKIP = /^\/(portal|requisition)(\/|$)/;

export default function sitemap() {
  return allPublicLinks()
    .filter((route) => !SKIP.test(route.href))
    .map((route) => ({
      url: `${siteConfig.url}${route.href === '/' ? '' : route.href}`,
      lastModified: new Date(),
      changeFrequency: route.href.startsWith('/legal') ? 'yearly' : route.href === '/' || route.href === '/notices' ? 'daily' : 'monthly',
      priority: route.href === '/' ? 1 : route.href.startsWith('/legal') ? 0.3 : 0.7,
    }));
}
