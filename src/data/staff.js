// Administration pages (/administration/...): the title and intro of each list.
// The people themselves are added in Dashboard → Teachers & Staff (stored in the database).
// Until a list has people, the page shows a "being updated" notice with the office contact.
export const staffGroups = [
  {
    slug: 'board-of-trustees',
    title: 'Board of Trustees',
    kicker: 'Leadership',
    intro: 'The Board of Trustees guides the vision, policy and long-term development of MA HAAD School & College.',
  },
  {
    slug: 'management',
    title: 'Managements',
    kicker: 'School Management',
    intro: 'The management team leads the day-to-day running of the school — academics, administration, accounts and student welfare.',
  },
  {
    slug: 'primary-teachers',
    title: 'Primary School Teachers',
    kicker: 'PG – Class V',
    intro: 'Our primary teachers give children a caring, joyful and strong start — from Play Group to Class V.',
  },
  {
    slug: 'junior-teachers',
    title: 'Junior School Teachers',
    kicker: 'Class VI – Class VIII',
    intro: 'Our junior school teachers help students build deeper subject knowledge, good study habits and independent learning.',
  },
  {
    slug: 'secondary-teachers',
    title: 'Secondary School Teachers',
    kicker: 'Class IX – Class X',
    intro: 'Our secondary teachers prepare students for the SSC examination with subject expertise, practical classes and close guidance.',
  },
];

export const getStaffGroup = (slug) => staffGroups.find((group) => group.slug === slug);
