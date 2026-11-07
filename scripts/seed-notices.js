// Adds 20 sample notices (with photos) for checking the notice board, or removes them again.
//   npm run seed-notices             → remove old samples, add 20 new ones
//   npm run seed-notices -- --remove → remove the samples only
// Only notices created by this script (marked `sample: true`) are touched.
import mongoose from 'mongoose';
import Notice from '../src/models/Notice.js';

const DAY = 24 * 60 * 60 * 1000;

// [days ago, category, title, summary, image, pinned, inTicker]
const SAMPLES = [
  [0, 'admission', 'Admission open for Session 2027 — PG to Class IX', 'Admission forms for Play Group to Class IX are now available at the school office from 9:00 am to 4:00 pm.', '/images/hero/students-and-teachers.jpg', true, true],
  [1, 'exam', 'Annual Examination 2026 — routine published', 'The Annual Examination for Class I to Class IX begins on 23 November 2026. Students must bring their admit cards every day.', '/images/facilities/library.jpg', true, true],
  [2, 'event', 'Annual Prize Giving & Cultural Ceremony', 'Parents are cordially invited to the Annual Prize Giving and Cultural Ceremony in the school auditorium.', '/images/hero/prize-giving.jpg', false, true],
  [3, 'important', 'Change in school timing during winter', 'From 15 November, classes will start at 8:30 am. Dismissal times remain the same for all sections.', '/images/school/school-bus.jpg', false, true],
  [5, 'general', 'Parent–Teacher Meeting for Class VI to Class X', 'A parent–teacher meeting will be held on Saturday from 10:00 am. Please collect your child’s progress report from the class teacher.', '/images/school/annual-sports-teachers.jpg', false, true],
  [6, 'event', 'Science Fair 2026 — project submission', 'Students of Class V to Class IX may submit their science projects to the Science Club coordinator by Thursday.', '/images/hero/science-class.jpg', false, true],
  [8, 'result', 'Half-yearly examination results published', 'Half-yearly results for Class I to Class IX are available. Report cards will be handed over at the parent–teacher meeting.', '/images/facilities/computer-lab.jpg', false, false],
  [10, 'holiday', 'School closed on account of a public holiday', 'The school will remain closed on the public holiday. Regular classes resume the following working day.', '/images/school/new-year-celebration.jpg', false, false],
  [12, 'event', 'Inter-house debate competition', 'The inter-house debate competition for Class VI to Class X will be held in the multipurpose hall. Topics are on the notice board.', '/images/facilities/debate-club.jpg', false, false],
  [15, 'general', 'Library books must be returned before the exams', 'All students are requested to return borrowed library books by the end of this week.', '/images/school/book-festival.jpg', false, false],
  [18, 'event', 'Art competition for Play Group to Class V', 'Young artists are invited to take part in the art competition. Drawing paper will be provided; bring your own colours.', '/images/hero/art-class.jpg', false, false],
  [21, 'important', 'Health check-up for all students', 'A free health check-up will be held in the medical room. Parents should inform the school of any known health conditions.', '/images/facilities/medical.jpg', false, false],
  [24, 'general', 'New digital classrooms for Class III to Class V', 'Three more classrooms have been fitted with multimedia boards to make lessons more interactive.', '/images/facilities/digital-classroom.jpg', false, false],
  [27, 'event', 'Annual Sports Day 2027 — house registration', 'Students who wish to take part in the Annual Sports Day must register with their house captain.', '/images/hero/sports-celebration.jpg', false, false],
  [30, 'admission', 'Admission test schedule for Class I to Class IX', 'The admission test for new students will be held on the dates listed below. Admit cards are issued at the office.', '/images/school/annual-sports-guests.jpg', false, false],
  [34, 'general', 'Uniform and ID card reminder', 'Students must wear the complete school uniform and ID card every day. Missing items are available at the school store.', '/images/school/sports-march-past.jpg', false, false],
  [38, 'result', 'Results of the inter-school sports meet', 'Congratulations to our athletes who won medals at the inter-school sports meet.', '/images/school/sports-trophy.jpg', false, false],
  [42, 'holiday', 'Puja vacation — school closed', 'The school will remain closed for the Puja vacation. Classes resume on the date shown in the academic calendar.', '/images/school/cultural-programme.jpg', false, false],
  [47, 'exam', 'Class tests for Class VI to Class X', 'Weekly class tests will be held every Sunday. Syllabus details have been given to the students.', '/images/facilities/laboratory.jpg', false, false],
  [52, 'general', 'Tuition fee payment reminder', 'Parents are requested to pay the monthly tuition fee by the 10th of each month at the accounts office.', '/images/school/sports-opening-ceremony.jpg', false, false],
];

function body(title, summary) {
  return [
    'Dear Parents and Students,',
    summary,
    `This notice is about: ${title}. For any questions, please contact the school office between 9:00 am and 6:00 pm on working days.`,
    'Thank you for your cooperation.\n\nPrincipal\nMA HAAD School & College',
  ].join('\n\n');
}

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing in .env');
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
const { deletedCount } = await Notice.deleteMany({ sample: true });
console.log(`Removed ${deletedCount} sample notice(s).`);

if (!process.argv.includes('--remove')) {
  const now = Date.now();
  const docs = SAMPLES.map(([daysAgo, category, title, summary, image, pinned, inTicker]) => ({
    title,
    category,
    summary,
    body: body(title, summary),
    image,
    date: new Date(now - daysAgo * DAY),
    status: 'published',
    pinned,
    inTicker,
    sample: true,
  }));
  await Notice.insertMany(docs);
  console.log(`Added ${docs.length} sample notices.`);
}

await mongoose.disconnect();
