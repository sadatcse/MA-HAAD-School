// Central place for the school's identity. Edit here — every page reads from this file.
export const siteConfig = {
  name: 'MA HAAD School & College',
  shortName: 'MA HAAD',
  tagline: 'Inspiring Young Minds, Nurturing Bright Futures',
  // Used in the browser-tab / search-result title of the home page and in link previews
  slogan: 'Inspiring Young Minds, Nurturing Bright Futures',
  description:
    'MA HAAD School & College is an English Version school in Khilkhet, Dhaka, following the National Curriculum of Bangladesh — quality education from Play Group to Class X in a supportive, student-friendly environment.',
  // One-line summary for the footer
  about:
    'An English Version school following the National Curriculum of Bangladesh, committed to quality education in a supportive, engaging and student-friendly environment.',
  curriculum: 'English Version · National Curriculum of Bangladesh',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  logo: '/logos/ma-haad-logo.png',
  icon: '/logos/ma-haad-icon-512.png',
  themeColor: '#126CB5',
  contact: {
    email: 'info@mahaad.edu.bd',
    // Shown as written; the dial link adds the +880 country code
    phones: ['01896-281602', '01753-555222'],
    callingTime: '9:00 am – 6:00 pm',
    address: 'House-49/A, Bot Tola, Khilkhet, Dhaka-1229, Bangladesh',
    addressShort: 'Bot Tola, Khilkhet, Dhaka-1229',
    mapUrl: 'https://maps.app.goo.gl/1kdhVMF3X8qiSPcW9',
    mapEmbed: 'https://maps.google.com/maps?q=23.8312461,90.4256367&z=17&hl=en&output=embed',
  },
  // Add the page links when they are ready; empty ones are hidden
  social: {
    facebook: '',
    youtube: '',
    linkedin: '',
  },
  // Mobile app store links — the footer badges become links once these are filled in
  apps: {
    appStore: '',
    googlePlay: '',
  },
};

// "01896-281602" → "tel:+8801896281602"
export function telHref(phone) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('880')) return `tel:+${digits}`;
  return `tel:+880${digits.replace(/^0/, '')}`;
}
