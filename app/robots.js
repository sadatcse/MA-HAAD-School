import { siteConfig } from '@/config/site';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard/', '/login', '/portal/', '/requisition/'] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
