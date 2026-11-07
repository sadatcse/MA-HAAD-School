// Login portals (menu: School Management Login / Requisition Login).
// When an online system is ready, put its address in `url` — the portal page will then send the
// user straight there. Until then the page shows the sign-in screen with office contact details.
const school = [
  { slug: 'primary-school', title: 'Primary School Portal', audience: 'Primary section (PG – Class V)', idLabel: 'Staff ID' },
  { slug: 'junior-school', title: 'Junior School Portal', audience: 'Junior section (Class VI – VIII)', idLabel: 'Staff ID' },
  { slug: 'secondary-school', title: 'Secondary School Portal', audience: 'Secondary section (Class IX – X)', idLabel: 'Staff ID' },
  { slug: 'parents', title: 'Parents Portal', audience: 'Parents and guardians', idLabel: 'Student ID' },
];

const requisition = [
  { slug: 'ceo', title: 'CEO', audience: 'Chief Executive Officer', idLabel: 'User ID' },
  { slug: 'principal', title: 'Principal', audience: 'Principal', idLabel: 'User ID' },
  { slug: 'admin', title: 'Admin', audience: 'Administration', idLabel: 'User ID' },
  { slug: 'hr', title: 'HR', audience: 'Human Resources', idLabel: 'User ID' },
  { slug: 'account', title: 'Account', audience: 'Accounts office', idLabel: 'User ID' },
  { slug: 'it', title: 'IT', audience: 'IT department', idLabel: 'User ID' },
  { slug: 'junior-school', title: 'Junior School Portal', audience: 'Junior section (Class VI – VIII)', idLabel: 'User ID' },
  { slug: 'secondary-school', title: 'Secondary School Portal', audience: 'Secondary section (Class IX – X)', idLabel: 'User ID' },
  { slug: 'parents', title: 'Parents Portal', audience: 'Parents and guardians', idLabel: 'Student ID' },
];

export const portalGroups = {
  portal: {
    key: 'portal',
    title: 'School Management Login',
    description: 'Sign in to the school management system for your section.',
    items: school.map((p) => ({ ...p, url: '' })),
  },
  requisition: {
    key: 'requisition',
    title: 'Requisition Login',
    description: 'Sign in to raise, approve and track requisitions.',
    items: requisition.map((p) => ({ ...p, url: '' })),
  },
};

export const getPortal = (group, slug) => portalGroups[group]?.items.find((p) => p.slug === slug);
