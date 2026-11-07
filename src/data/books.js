// Built-in book list for session 2027 (copied into the database by `npm run seed-content`).
// The book list is managed in Dashboard → Academic Sessions → Book list.
// NCTB = Government textbook (English Version); "School" = books selected by MA HAAD.
export const booksSession = '2027';

export const bookLevels = [
  {
    level: 'Pre-Primary',
    classes: [
      {
        name: 'Play Group',
        books: [
          { title: 'English Alphabet & Phonics', source: 'School' },
          { title: 'Bangla Bornomala', source: 'School' },
          { title: 'Numbers (1–20)', source: 'School' },
          { title: 'Rhymes & Poems', source: 'School' },
          { title: 'Drawing & Colouring', source: 'School' },
        ],
      },
      {
        name: 'Nursery',
        books: [
          { title: 'English Reading & Writing', source: 'School' },
          { title: 'Bangla Reading & Writing', source: 'School' },
          { title: 'Mathematics (Numbers 1–50)', source: 'School' },
          { title: 'Rhymes & Poems', source: 'School' },
          { title: 'General Knowledge', source: 'School' },
          { title: 'Drawing & Colouring', source: 'School' },
        ],
      },
      {
        name: 'KG',
        books: [
          { title: 'English Reader & Grammar', source: 'School' },
          { title: 'Bangla Reader', source: 'School' },
          { title: 'Mathematics (Numbers 1–100)', source: 'School' },
          { title: 'Rhymes & Poems', source: 'School' },
          { title: 'General Knowledge', source: 'School' },
          { title: 'Drawing & Colouring', source: 'School' },
        ],
      },
    ],
  },
  {
    level: 'Primary',
    classes: [
      {
        name: 'Class I – II',
        books: [
          { title: 'English For Today', source: 'NCTB' },
          { title: 'Amar Bangla Boi', source: 'NCTB' },
          { title: 'Primary Mathematics', source: 'NCTB' },
          { title: 'English Grammar', source: 'School' },
          { title: 'General Knowledge', source: 'School' },
          { title: 'Drawing', source: 'School' },
        ],
      },
      {
        name: 'Class III – V',
        books: [
          { title: 'English For Today', source: 'NCTB' },
          { title: 'Amar Bangla Boi', source: 'NCTB' },
          { title: 'Primary Mathematics', source: 'NCTB' },
          { title: 'Primary Science', source: 'NCTB' },
          { title: 'Bangladesh and Global Studies', source: 'NCTB' },
          { title: 'Religion & Moral Education', source: 'NCTB' },
          { title: 'English Grammar & Composition', source: 'School' },
          { title: 'Bangla Grammar', source: 'School' },
        ],
      },
    ],
  },
  {
    level: 'Junior',
    classes: [
      {
        name: 'Class VI – VIII',
        books: [
          { title: 'English For Today', source: 'NCTB' },
          { title: 'English Grammar and Composition', source: 'NCTB' },
          { title: 'Bangla Sahitya (Charupath)', source: 'NCTB' },
          { title: 'Bangla Bhashar Byakaran', source: 'NCTB' },
          { title: 'Mathematics', source: 'NCTB' },
          { title: 'Science', source: 'NCTB' },
          { title: 'Bangladesh and Global Studies', source: 'NCTB' },
          { title: 'Information and Communication Technology', source: 'NCTB' },
          { title: 'Religion & Moral Education', source: 'NCTB' },
          { title: 'Agriculture Studies / Home Science', source: 'NCTB' },
          { title: 'Work and Life Oriented Education', source: 'NCTB' },
          { title: 'Physical Education & Health', source: 'NCTB' },
          { title: 'Arts and Crafts', source: 'NCTB' },
        ],
      },
    ],
  },
  {
    level: 'Secondary (SSC)',
    classes: [
      {
        name: 'Class IX – X · Common subjects',
        books: [
          { title: 'Bangla Sahitya & Bangla Shahitya Sonkolon', source: 'NCTB' },
          { title: 'Bangla Bhashar Byakaran o Nirmiti', source: 'NCTB' },
          { title: 'English For Today', source: 'NCTB' },
          { title: 'English Grammar and Composition', source: 'NCTB' },
          { title: 'Mathematics', source: 'NCTB' },
          { title: 'Information and Communication Technology', source: 'NCTB' },
          { title: 'Religion & Moral Education', source: 'NCTB' },
          { title: 'Physical Education, Health Science & Sports', source: 'NCTB' },
          { title: 'Career Education', source: 'NCTB' },
        ],
      },
      {
        name: 'Science group',
        books: [
          { title: 'Physics', source: 'NCTB' },
          { title: 'Chemistry', source: 'NCTB' },
          { title: 'Biology', source: 'NCTB' },
          { title: 'Higher Mathematics', source: 'NCTB' },
          { title: 'Bangladesh and Global Studies', source: 'NCTB' },
        ],
      },
      {
        name: 'Business Studies group',
        books: [
          { title: 'Accounting', source: 'NCTB' },
          { title: 'Finance & Banking', source: 'NCTB' },
          { title: 'Business Entrepreneurship', source: 'NCTB' },
          { title: 'General Science', source: 'NCTB' },
        ],
      },
      {
        name: 'Humanities group',
        books: [
          { title: 'History of Bangladesh and World Civilization', source: 'NCTB' },
          { title: 'Geography and Environment', source: 'NCTB' },
          { title: 'Civics and Citizenship', source: 'NCTB' },
          { title: 'Economics', source: 'NCTB' },
          { title: 'General Science', source: 'NCTB' },
        ],
      },
    ],
  },
];
