import { TbLayoutDashboard } from 'react-icons/tb';
import { FaGlobe, FaCog, FaSignInAlt, FaHistory, FaBullhorn, FaImages, FaUsers, FaUserTie, FaCalendarAlt } from 'react-icons/fa';

// Public site menu (header + mobile menu). Items with `children` open a dropdown.
export const mainNav = [
  { label: 'Home', href: '/' },
  {
    label: 'About Us',
    href: '/about',
    children: [
      { label: 'About MA HAAD School and College', href: '/about' },
      { label: "CEO's Message", href: '/about/ceo-message' },
      { label: "Principal's Message", href: '/about/principal-message' },
    ],
  },
  {
    label: 'Facilities',
    href: '/facilities',
    children: [
      { label: 'Library', href: '/facilities/library' },
      { label: 'Laboratory', href: '/facilities/laboratory' },
      { label: 'Medical', href: '/facilities/medical' },
      { label: 'Digital Class Room', href: '/facilities/digital-classroom' },
      { label: 'Computer Lab', href: '/facilities/computer-lab' },
      { label: 'Debate Club', href: '/facilities/debate-club' },
    ],
  },
  {
    label: 'Admission',
    href: '/admission',
    children: [
      { label: 'PG – KG', href: '/admission/pg-kg' },
      { label: 'Class I – Class V', href: '/admission/class-1-5' },
      { label: 'Class VI – Class X', href: '/admission/class-6-10' },
      { label: 'Admission Information', href: '/admission/information' },
      { label: 'Rules and Regulations', href: '/admission/rules-and-regulations' },
      { label: 'Transfer Procedure', href: '/admission/transfer-procedure' },
      { label: 'Prospectus', href: '/admission/prospectus' },
    ],
  },
  {
    label: 'Campus',
    href: '/campus',
    children: [
      { label: 'Books', href: '/campus/books' },
      { label: 'List of Holidays', href: '/campus/holidays' },
      { label: 'Academic Calendar', href: '/campus/academic-calendar' },
    ],
  },
  {
    label: 'Administration',
    href: '/administration',
    children: [
      { label: 'Board of Trustees', href: '/administration/board-of-trustees' },
      { label: 'Managements', href: '/administration/management' },
      { label: 'Primary School Teachers', href: '/administration/primary-teachers' },
      { label: 'Junior School Teachers', href: '/administration/junior-teachers' },
      { label: 'Secondary School Teachers', href: '/administration/secondary-teachers' },
    ],
  },
  { label: 'Photo Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact' },
];

// Footer columns
export const footerNav = {
  quick: [
    { label: 'About Us', href: '/about' },
    { label: 'Notice Board', href: '/notices' },
    { label: 'Academic Calendar', href: '/campus/academic-calendar' },
    { label: 'List of Holidays', href: '/campus/holidays' },
    { label: 'Photo Gallery', href: '/gallery' },
    { label: 'Contact Us', href: '/contact' },
  ],
  admission: [
    { label: 'PG – KG', href: '/admission/pg-kg' },
    { label: 'Class I – Class V', href: '/admission/class-1-5' },
    { label: 'Class VI – Class X', href: '/admission/class-6-10' },
    { label: 'Admission Information', href: '/admission/information' },
    { label: 'Rules and Regulations', href: '/admission/rules-and-regulations' },
    { label: 'Prospectus', href: '/admission/prospectus' },
  ],
  useful: [
    { label: 'Ministry of Education', href: 'https://moedu.gov.bd' },
    { label: 'Ministry of Primary & Mass Education', href: 'https://mopme.gov.bd' },
    { label: 'Dhaka Education Board', href: 'https://dhakaeducationboard.gov.bd' },
    { label: 'NCTB', href: 'https://nctb.gov.bd' },
    { label: 'Directorate of Secondary & Higher Education', href: 'https://dshe.gov.bd' },
    { label: 'Directorate of Primary Education', href: 'https://dpe.gov.bd' },
  ],
};

export const legalNav = [
  { label: 'Terms of Use', href: '/legal/termsofuse' },
  { label: 'Privacy Policy', href: '/legal/appprivacypolicy' },
  { label: 'Cookie Policy', href: '/legal/cookiepolicy' },
  { label: 'Refund Policy', href: '/legal/refundpolicy' },
];

// The dropdown links of one top-level item, e.g. sectionLinks('/admission') — used for page sidebars
export const sectionLinks = (href) => mainNav.find((item) => item.href === href)?.children || [];

// Every public page, for the sitemap
export function allPublicLinks() {
  const seen = new Set();
  const links = [];
  const add = (link) => {
    if (link.href.startsWith('http') || seen.has(link.href)) return;
    seen.add(link.href);
    links.push(link);
  };
  mainNav.forEach((item) => {
    add(item);
    item.children?.forEach(add);
  });
  [...footerNav.quick, ...legalNav].forEach(add);
  return links;
}

// Admin dashboard sidebar
export const dashboardNav = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: TbLayoutDashboard },
      { label: 'Traffic Analytics', href: '/dashboard/traffic', icon: FaGlobe },
    ],
  },
  {
    title: 'Website',
    items: [
      { label: 'Notices', href: '/dashboard/notices', icon: FaBullhorn },
      { label: 'Photo Gallery', href: '/dashboard/gallery', icon: FaImages },
      { label: 'Teachers & Staff', href: '/dashboard/staff', icon: FaUsers },
      { label: 'CEO & Principal', href: '/dashboard/leaders', icon: FaUserTie },
      { label: 'Academic Sessions', href: '/dashboard/sessions', icon: FaCalendarAlt },
    ],
  },
  {
    title: 'Security',
    items: [
      { label: 'Login History', href: '/dashboard/login-history', icon: FaSignInAlt },
      { label: 'User Activity', href: '/dashboard/activity', icon: FaHistory },
    ],
  },
  {
    title: 'System',
    items: [{ label: 'Settings', href: '/dashboard/settings', icon: FaCog }],
  },
];

// Routes where the public header/footer are hidden
export const appOnlyRoutes = ['/dashboard', '/login'];
