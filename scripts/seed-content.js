// Copies the built-in website content into the database, so it can be edited in the dashboard:
// photo gallery, CEO / Principal messages and the academic session (holidays, calendar, books).
//   npm run seed-content
// Only empty sections are filled — nothing already saved in the dashboard is changed.
import mongoose from 'mongoose';
import GalleryPhoto from '../src/models/GalleryPhoto.js';
import Leader from '../src/models/Leader.js';
import AcademicSession from '../src/models/AcademicSession.js';
import { gallery } from '../src/data/gallery.js';
import { messages } from '../src/data/school.js';
import { session, holidays, academicEvents } from '../src/data/calendar.js';
import { bookLevels } from '../src/data/books.js';

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing in .env');
  process.exit(1);
}
await mongoose.connect(process.env.MONGO_URI);

if (await GalleryPhoto.exists({})) {
  console.log('Gallery: already has photos — skipped.');
} else {
  await GalleryPhoto.insertMany(gallery.map((p, order) => ({ src: p.src, title: p.title, category: p.category, width: p.width, height: p.height, order })));
  console.log(`Gallery: added ${gallery.length} photos.`);
}

for (const m of Object.values(messages)) {
  if (await Leader.exists({ slug: m.slug })) {
    console.log(`${m.label}: already saved — skipped.`);
    continue;
  }
  await Leader.create({ slug: m.slug, name: m.name, role: m.role, photo: m.photo, heading: m.heading, excerpt: m.excerpt, body: m.paragraphs.join('\n\n') });
  console.log(`${m.label}: saved.`);
}

if (await AcademicSession.exists({ year: session.year })) {
  console.log(`Session ${session.year}: already saved — skipped.`);
} else {
  const current = !(await AcademicSession.exists({ current: true }));
  await AcademicSession.create({
    year: session.year,
    label: session.label,
    weekend: session.weekend,
    confirmed: session.confirmed,
    current,
    holidays,
    events: academicEvents,
    books: bookLevels,
  });
  console.log(`Session ${session.year}: saved (${holidays.length} holidays, ${academicEvents.length} calendar items, book list).`);
}

await mongoose.disconnect();
