// School content shown across the website. Edit the text here — pages read from this file.
import {
  FaBookOpen, FaFlask, FaHeartbeat, FaChalkboardTeacher, FaLaptopCode, FaMicrophoneAlt,
  FaGraduationCap, FaUserTie, FaLanguage, FaLightbulb, FaHandsHelping, FaShieldAlt,
  FaBullseye, FaEye, FaHeart, FaPalette, FaUsers, FaSmile, FaBalanceScale,
} from 'react-icons/fa';

export const images = {
  marchPast: '/images/school/sports-march-past.jpg',
  podium: '/images/school/sports-podium.jpg',
  trophy: '/images/school/sports-trophy.jpg',
  prizeWinners: '/images/school/sports-prize-winners.jpg',
  openingCeremony: '/images/school/sports-opening-ceremony.jpg',
  sportsGuests: '/images/school/annual-sports-guests.jpg',
  sportsTeachers: '/images/school/annual-sports-teachers.jpg',
  sportsTeam: '/images/school/annual-sports-team.jpg',
  cultural: '/images/school/cultural-programme.jpg',
  newYear: '/images/school/new-year-celebration.jpg',
  art: '/images/school/art-competition.jpg',
  scienceLab: '/images/school/science-lab.jpg',
  bookFestival: '/images/school/book-festival.jpg',
  debate: '/images/school/debate-speech.jpg',
  bus: '/images/school/school-bus.jpg',
};

// ---------- Home hero slider ----------
export const heroSlides = [
  {
    image: '/images/hero/students-and-teachers.jpg',
    position: 'object-[60%_50%]',
    kicker: 'Welcome to MA HAAD School & College',
    title: 'Inspiring Young Minds, Nurturing Bright Futures',
    text: 'An English Version school following the National Curriculum of Bangladesh.',
  },
  {
    image: '/images/hero/science-class.jpg',
    position: 'object-[65%_50%]',
    kicker: 'Learning by doing',
    title: 'Curious minds, meaningful classroom experiences',
    text: 'Strong academic foundations, critical thinking and creativity for every learner.',
  },
  {
    image: '/images/hero/sports-celebration.jpg',
    position: 'object-[70%_50%]',
    kicker: 'Beyond the classroom',
    title: 'Confidence built on the field, the stage and in class',
    text: 'Sports, culture and clubs that help every child discover their strengths.',
  },
  {
    image: '/images/hero/art-class.jpg',
    position: 'object-[40%_50%]',
    kicker: 'Creative learning',
    title: 'Room to imagine, create and express',
    text: 'Art, craft and cultural activities that nurture creativity and independent learning.',
  },
  {
    image: '/images/hero/prize-giving.jpg',
    position: 'object-[60%_50%]',
    kicker: 'Every child matters',
    title: 'A place to learn, grow, and achieve',
    text: 'A supportive, engaging and student-friendly environment from Play Group to Class X.',
  },
];

// ---------- About ----------
export const welcome = {
  title: 'Welcome to MA HAAD School & College',
  tagline: 'Inspiring Young Minds, Nurturing Bright Futures',
  paragraphs: [
    'Welcome to MA HAAD School & College, where education is more than just learning from textbooks—it is a journey of discovery, personal growth, and lifelong learning. As an English Version school following the National Curriculum of Bangladesh, we are committed to providing quality education in a supportive, engaging, and student-friendly environment where every child is encouraged to learn, explore, and achieve their full potential.',
    'At MA HAAD School & College, we believe that every student is unique and possesses the ability to learn, grow, and succeed. Our educational approach focuses on building strong academic foundations, developing English language proficiency, encouraging critical thinking, and nurturing creativity, confidence, and independent learning. Through meaningful classroom experiences and effective teaching practices, we strive to make learning enjoyable, purposeful, and relevant to the needs of today’s learners.',
    'We recognize that education plays a vital role in shaping not only a student’s academic future but also their character, values, and sense of responsibility. Therefore, we encourage our students to develop honesty, discipline, respect, kindness, teamwork, and a positive attitude towards life. We aim to create an environment where students feel valued, express their ideas confidently, ask questions freely, and learn to respect different perspectives.',
    'We also believe that a successful educational journey depends on the strong partnership between students, teachers, parents, and the school community. Through guidance, encouragement, and cooperation, we strive to support the overall development of every learner and help them build the knowledge, skills, and confidence needed to face future challenges.',
    'Our commitment extends beyond academic achievement. We aspire to nurture curious minds, responsible citizens, creative thinkers, and confident individuals who are prepared to embrace opportunities and contribute positively to society.',
    'At MA HAAD School & College, every child matters, every learning experience has value, and every step forward is an opportunity to grow.',
    'Together, we are building a future where knowledge inspires excellence, character guides success, and every learner has the opportunity to shine.',
  ],
  closing: 'Welcome to the MA HAAD family—a place to learn, grow, and achieve.',
};

export const highlights = [
  { icon: FaLanguage, label: 'English Version' },
  { icon: FaBookOpen, label: 'National Curriculum of Bangladesh' },
  { icon: FaGraduationCap, label: 'Play Group to Class X' },
  { icon: FaHandsHelping, label: 'Student-friendly environment' },
];

export const purpose = [
  {
    icon: FaBullseye,
    title: 'Our Mission',
    text: 'To provide quality education in a supportive, engaging and student-friendly environment where every child is encouraged to learn, explore and achieve their full potential.',
  },
  {
    icon: FaEye,
    title: 'Our Vision',
    text: 'To nurture curious minds, responsible citizens, creative thinkers and confident individuals who are prepared to embrace opportunities and contribute positively to society.',
  },
  {
    icon: FaHeart,
    title: 'Our Values',
    text: 'Honesty, discipline, respect, kindness, teamwork and a positive attitude towards life — values that guide our students in school and beyond.',
  },
];

// Six values from the school's welcome message (home page band)
export const values = [
  { icon: FaShieldAlt, title: 'Honesty' },
  { icon: FaBalanceScale, title: 'Discipline' },
  { icon: FaHandsHelping, title: 'Respect' },
  { icon: FaHeart, title: 'Kindness' },
  { icon: FaUsers, title: 'Teamwork' },
  { icon: FaSmile, title: 'Positive Attitude' },
];

export const approach = [
  { icon: FaGraduationCap, title: 'Strong Academic Foundations', text: 'A well-planned National Curriculum programme in English Version, taught with care from the earliest classes.' },
  { icon: FaLanguage, title: 'English Language Proficiency', text: 'Daily practice in reading, writing, listening and speaking so students communicate with confidence.' },
  { icon: FaLightbulb, title: 'Critical Thinking', text: 'Students are encouraged to ask questions freely, solve problems and respect different perspectives.' },
  { icon: FaPalette, title: 'Creativity & Confidence', text: 'Art, culture, debate and sports help every child express ideas and discover their strengths.' },
  { icon: FaChalkboardTeacher, title: 'Effective Teaching', text: 'Meaningful classroom experiences that make learning enjoyable, purposeful and relevant.' },
  { icon: FaHandsHelping, title: 'School–Family Partnership', text: 'Students, teachers and parents working together to support the overall development of every learner.' },
];

// ---------- Messages ----------
// Built-in text for the CEO / Principal pages. Once saved in Dashboard → CEO & Principal,
// the database version is shown instead. The names below are placeholders.
export const messages = {
  'ceo-message': {
    slug: 'ceo-message',
    banner: images.sportsGuests,
    label: "CEO's Message",
    role: 'Chief Executive Officer',
    name: 'Md. Rafiqul Islam', // placeholder name — replace with the real name
    photo: '/images/people/ceo.webp',
    heading: 'A message from our CEO',
    focus: ['Every child is unique', 'Values that build character', 'Dedicated teachers & modern facilities', 'Parents as partners'],
    excerpt:
      'At MA HAAD School & College we believe that every child is unique and deserves an education that builds knowledge, character and confidence. Our promise to every family is a safe, caring and inspiring place to learn.',
    paragraphs: [
      'It gives me great pleasure to welcome you to MA HAAD School & College. Our school was built on a simple belief: every child is unique, and every child deserves the opportunity to learn, grow and succeed.',
      'As an English Version school following the National Curriculum of Bangladesh, we combine a strong academic programme with the values that shape good character — honesty, discipline, respect, kindness and teamwork. We want our students to leave school not only with good results, but with the confidence and responsibility to make a positive contribution to society.',
      'We continue to invest in the things that make a real difference to learning: dedicated teachers, a well-resourced library, science and computer laboratories, digital classrooms, medical care and a lively programme of co-curricular activities such as debate, sports and cultural events.',
      'A school succeeds when students, teachers and parents work together. I warmly invite every parent to stay closely involved in their child’s journey with us. Your trust and partnership are our greatest strengths.',
      'Welcome to the MA HAAD family — a place to learn, grow, and achieve.',
    ],
  },
  'principal-message': {
    slug: 'principal-message',
    banner: images.sportsTeachers,
    label: "Principal's Message",
    role: 'Principal',
    name: 'Abdul Karim Chowdhury', // placeholder name — replace with the real name
    photo: '/images/people/principal.webp',
    heading: 'A message from our Principal',
    focus: ['Strong academic foundations', 'English language proficiency', 'Critical thinking & creativity', 'Discipline, punctuality & good manners'],
    excerpt:
      'Education is more than learning from textbooks — it is a journey of discovery, personal growth and lifelong learning. Our teachers make every classroom a place where children feel valued and love to learn.',
    paragraphs: [
      'Dear students, parents and well-wishers, welcome to MA HAAD School & College.',
      'Education is more than learning from textbooks — it is a journey of discovery, personal growth and lifelong learning. In our classrooms we focus on building strong academic foundations, developing English language proficiency, encouraging critical thinking and nurturing creativity and independent learning.',
      'Our teachers know each child well. Through effective teaching practices, regular assessment and caring guidance, we help every learner move forward at the right pace. We want our students to feel valued, to express their ideas confidently, to ask questions freely and to respect different perspectives.',
      'Alongside academics, we give equal importance to discipline, punctuality and good manners. Our co-curricular programme — debate, art, cultural events and the annual sports — gives every child the chance to shine beyond the classroom.',
      'I thank our parents for their continued cooperation and encourage them to stay in regular contact with the class teachers. Together, let us build a future where knowledge inspires excellence, character guides success, and every learner has the opportunity to shine.',
    ],
  },
};

// ---------- Facilities ----------
export const facilities = [
  {
    slug: 'library',
    title: 'Library',
    icon: FaBookOpen,
    image: '/images/facilities/library.jpg',
    summary: 'A quiet, welcoming library with textbooks, story books and reference materials for every age group.',
    paragraphs: [
      'Our library is the heart of reading at MA HAAD. It offers National Curriculum textbooks, English and Bangla story books, encyclopaedias, dictionaries and general-knowledge titles chosen for young readers.',
      'Every class has regular library periods. Students learn how to choose books, borrow and return them responsibly, and develop a lifelong habit of reading for pleasure and for learning.',
    ],
    features: ['Textbooks and reference books for PG to Class X', 'English and Bangla story books', 'Weekly library periods for each class', 'Book borrowing for students', 'Reading corners for junior classes', 'Annual book festival and reading activities'],
  },
  {
    slug: 'laboratory',
    title: 'Laboratory',
    icon: FaFlask,
    image: '/images/facilities/laboratory.jpg',
    summary: 'Science laboratory where students turn lessons into hands-on experiments under teacher supervision.',
    paragraphs: [
      'Science is best learned by doing. In our laboratory students carry out practical work in physics, chemistry and biology that brings their textbook lessons to life.',
      'All practical classes are supervised by subject teachers, and students are taught to follow safety rules, record observations carefully and draw their own conclusions.',
    ],
    features: ['Practical classes for physics, chemistry and biology', 'Experiments linked to the National Curriculum', 'Teacher-supervised sessions', 'Safety rules and equipment', 'Preparation for SSC practical examinations', 'Science fair projects'],
  },
  {
    slug: 'medical',
    title: 'Medical',
    icon: FaHeartbeat,
    image: '/images/facilities/medical.jpg',
    summary: 'First-aid and medical support on campus so that every child is cared for during the school day.',
    paragraphs: [
      'The health and safety of our students comes first. The school keeps a first-aid room with basic medical supplies, and staff are ready to look after any student who feels unwell or is injured during the school day.',
      'Parents are informed immediately in case of illness or injury. We encourage parents to keep the school updated about any allergies, medical conditions or medicines their child needs.',
    ],
    features: ['First-aid room with basic medicines', 'Immediate care for minor illness and injuries', 'Parents contacted without delay', 'Health records kept for each student', 'Health and hygiene awareness sessions', 'Rest area for students who feel unwell'],
  },
  {
    slug: 'digital-classroom',
    title: 'Digital Class Room',
    icon: FaChalkboardTeacher,
    image: '/images/facilities/digital-classroom.jpg',
    summary: 'Multimedia classrooms that make lessons visual, interactive and easier to understand.',
    paragraphs: [
      'Our digital classrooms are equipped with multimedia projectors and sound systems so teachers can use pictures, videos, animations and presentations in their lessons.',
      'Visual learning helps students understand difficult ideas, keeps lessons engaging and prepares children to learn confidently with technology.',
    ],
    features: ['Multimedia projector and sound system', 'Videos, animations and presentations in lessons', 'Interactive learning activities', 'Digital content for the National Curriculum', 'Engaging lessons for every class', 'Comfortable, well-lit classrooms'],
  },
  {
    slug: 'computer-lab',
    title: 'Computer Lab',
    icon: FaLaptopCode,
    image: '/images/facilities/computer-lab.jpg',
    summary: 'A computer lab where students learn ICT skills, typing, internet safety and basic programming.',
    paragraphs: [
      'In the computer lab every student gets hands-on practice with computers. Lessons follow the ICT subject of the National Curriculum and build practical digital skills step by step.',
      'Students learn to use word processing and presentation software, search the internet safely and responsibly, and are introduced to basic programming ideas.',
    ],
    features: ['Hands-on practice for every student', 'ICT lessons as per the National Curriculum', 'Typing, documents and presentations', 'Safe and responsible internet use', 'Introduction to programming', 'Supervised by the ICT teacher'],
  },
  {
    slug: 'debate-club',
    title: 'Debate Club',
    icon: FaMicrophoneAlt,
    image: '/images/facilities/debate-club.jpg',
    summary: 'A club that builds confident speakers — debate, recitation, public speaking and extempore.',
    paragraphs: [
      'The Debate Club gives students a platform to think critically, express their ideas clearly and listen to different points of view with respect.',
      'Members take part in regular practice sessions, inter-class debates, recitation and public-speaking events, and represent the school in competitions.',
    ],
    features: ['English and Bangla debate', 'Public speaking and extempore speech', 'Recitation and storytelling', 'Inter-class debate competitions', 'Training by teacher-moderators', 'Builds confidence and leadership'],
  },
];

// ---------- Admission ----------
// Classes offered at each level (admission pages + home "Our Programmes")
export const programs = [
  {
    slug: 'pg-kg',
    title: 'PG – KG',
    level: 'Pre-Primary',
    image: images.newYear,
    classes: ['Play Group', 'Nursery', 'KG'],
    summary: 'A joyful, caring start to school life through play, stories, rhymes and early reading, writing and numbers.',
    paragraphs: [
      'Our pre-primary section (Play Group, Nursery and KG) gives young children a gentle and joyful start to school. Learning happens through play, stories, rhymes, songs, drawing and hands-on activities.',
      'Children build early English and Bangla reading and writing, number sense, fine-motor skills and good habits such as sharing, listening and taking turns — preparing them confidently for Class I.',
    ],
    ages: [
      { className: 'Play Group', age: '3+ years' },
      { className: 'Nursery', age: '4+ years' },
      { className: 'KG', age: '5+ years' },
    ],
    subjects: ['English', 'Bangla', 'Mathematics', 'Rhymes & Poems', 'General Knowledge', 'Drawing & Colouring'],
    assessment: 'Admission to Play Group is through a short, friendly meeting with the child and parents. Nursery and KG admission includes a simple oral assessment of letters, numbers and rhymes.',
  },
  {
    slug: 'class-1-5',
    title: 'Class I – Class V',
    level: 'Primary',
    image: images.cultural,
    classes: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'],
    summary: 'Strong foundations in English, Bangla, Mathematics and Science following the National Curriculum in English Version.',
    paragraphs: [
      'The primary section follows the National Curriculum of Bangladesh in English Version. Students develop strong foundations in English, Bangla and Mathematics, and are introduced to Science, Bangladesh & Global Studies and Religion & Moral Education.',
      'Lessons are activity-based and interactive. Regular class tests, homework and parent–teacher meetings help us track progress and support every child.',
    ],
    ages: [
      { className: 'Class I', age: '6+ years' },
      { className: 'Class II', age: '7+ years' },
      { className: 'Class III', age: '8+ years' },
      { className: 'Class IV', age: '9+ years' },
      { className: 'Class V', age: '10+ years' },
    ],
    subjects: ['English', 'Bangla', 'Mathematics', 'Science', 'Bangladesh & Global Studies', 'Religion & Moral Education', 'Drawing', 'Physical Education'],
    assessment: 'Admission is based on a written test in English, Bangla and Mathematics followed by a short interview with the student and parents.',
  },
  {
    slug: 'class-6-10',
    title: 'Class VI – Class X',
    level: 'Junior & Secondary',
    image: images.scienceLab,
    classes: ['Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X'],
    summary: 'Junior secondary and secondary education leading to the SSC examination, with Science, Business Studies and Humanities groups.',
    paragraphs: [
      'Classes VI–VIII (junior section) build deeper subject knowledge across Bangla, English, Mathematics, Science, ICT, Bangladesh & Global Studies and more. Classes IX–X (secondary section) prepare students for the SSC examination under the Board of Intermediate and Secondary Education, Dhaka.',
      'In Class IX students choose a group — Science, Business Studies or Humanities — according to their interest and results. Practical classes, model tests and extra care for examination candidates help every student do their best.',
    ],
    ages: [
      { className: 'Class VI', age: '11+ years' },
      { className: 'Class VII', age: '12+ years' },
      { className: 'Class VIII', age: '13+ years' },
      { className: 'Class IX', age: '14+ years' },
      { className: 'Class X', age: 'Transfer only, with board rules' },
    ],
    subjects: ['Bangla', 'English', 'Mathematics', 'Science / group subjects', 'ICT', 'Bangladesh & Global Studies', 'Religion & Moral Education', 'Physical Education & Health'],
    assessment: 'Admission is based on a written test in English, Bangla, Mathematics and General Science, followed by an interview. Admission to Class IX and X follows the rules of the Dhaka Education Board.',
  },
];

export const admissionInfo = {
  intro:
    'Admission to MA HAAD School & College is open for Play Group to Class IX for the new academic session, and in other months when seats are available. Parents are welcome to visit the school, meet our teachers and see the campus.',
  steps: [
    { title: 'Collect the form', text: 'Collect the admission form from the school office, or ask for it by phone.' },
    { title: 'Submit the form', text: 'Submit the completed form with the required documents and the admission-test fee.' },
    { title: 'Admission test', text: 'Your child sits for an age-appropriate admission test or assessment on the given date.' },
    { title: 'Interview', text: 'A short meeting with the student and parents/guardians.' },
    { title: 'Result', text: 'Results are announced on the notice board and by phone.' },
    { title: 'Confirm admission', text: 'Complete admission by paying the admission and monthly fees within the given date.' },
  ],
  documents: [
    'Completed admission form',
    'Online birth registration certificate of the student (photocopy)',
    'Four recent passport-size colour photographs of the student',
    'Two passport-size photographs of each parent / guardian',
    'National ID card of both parents (photocopy)',
    'Transfer Certificate (TC) and last report card — for students coming from another school (Class I and above)',
    'Vaccination card — for Play Group to KG',
  ],
  notes: [
    'Seats are limited and given on the basis of the admission test and interview.',
    'Admission and monthly fee details are available at the school office.',
    'Incomplete forms or forms without the required documents will not be accepted.',
    'The decision of the admission committee is final.',
  ],
};

export const rules = [
  {
    title: 'Attendance & punctuality',
    items: [
      'Students must arrive at school at least 10 minutes before the first bell.',
      'At least 80% attendance is required to sit for the annual examination.',
      'For any absence, parents must send a written application on the day the student returns.',
      'Students may not leave the campus during school hours without written permission from the Principal or class teacher.',
    ],
  },
  {
    title: 'Uniform & appearance',
    items: [
      'Students must wear the complete, clean school uniform with the school ID card every day.',
      'Hair must be neat and tidy; nails kept short and clean.',
      'Jewellery, fashion accessories and coloured shoes are not allowed.',
    ],
  },
  {
    title: 'Conduct & discipline',
    items: [
      'Students must be respectful and polite to teachers, staff, guests and fellow students.',
      'Bullying, fighting, using bad language or damaging school property are serious offences.',
      'Mobile phones, smart watches and electronic gadgets are not allowed on campus.',
      'Students are expected to keep the classrooms and campus clean.',
    ],
  },
  {
    title: 'Studies & examinations',
    items: [
      'Homework and class work must be completed regularly and on time.',
      'Students must bring the books and materials needed for each day.',
      'Unfair means in any test or examination will lead to cancellation of that examination.',
      'Missed examinations are not normally retaken, except for medical reasons with a doctor’s certificate.',
    ],
  },
  {
    title: 'Fees',
    items: [
      'Monthly tuition fees must be paid by the 10th of each month.',
      'A late fee may be charged for payment after the due date.',
      'Students with unpaid dues may not be allowed to sit for examinations.',
      'Fees once paid are not refundable.',
    ],
  },
  {
    title: 'Parents & guardians',
    items: [
      'Parents should attend parent–teacher meetings and check the diary and notices regularly.',
      'Only parents or authorised guardians with the guardian card may collect a student.',
      'Any change of address or phone number must be reported to the office immediately.',
      'Parents may meet teachers during the visiting hours fixed by the school.',
    ],
  },
];

export const transferProcedure = {
  intro:
    'A Transfer Certificate (TC) is issued when a student leaves MA HAAD School & College to join another school. Students coming to MA HAAD from another school must also bring a TC from their previous school.',
  leaving: [
    { title: 'Written application', text: 'The parent / guardian submits a written application to the Principal stating the reason for the transfer.' },
    { title: 'Clear all dues', text: 'All tuition fees and other dues must be paid up to the month of leaving.' },
    { title: 'Return school items', text: 'Return library books, the ID card and any other school property.' },
    { title: 'TC fee', text: 'Pay the Transfer Certificate fee at the accounts office.' },
    { title: 'Collect the TC', text: 'The TC is normally ready within 7 working days of the application.' },
  ],
  joining: [
    'Transfer Certificate from the previous school (original)',
    'Last examination report card / mark sheet',
    'Online birth registration certificate',
    'For Class IX–X, transfer must follow the rules and approval of the Dhaka Education Board',
  ],
  notes: [
    'A TC is issued only to the parent / guardian registered with the school.',
    'Duplicate TCs are issued only on a written application with a valid reason.',
  ],
};

export const prospectus = {
  intro:
    'This online prospectus gives families an overview of MA HAAD School & College — who we are, what we teach and how to join us. A printed copy is available at the school office together with the admission form.',
  sections: [
    { title: 'About the school', text: 'An English Version school in Khilkhet, Dhaka, following the National Curriculum of Bangladesh, from Play Group to Class X.' },
    { title: 'Classes offered', text: 'Pre-primary (Play Group, Nursery, KG), Primary (Class I–V), Junior (Class VI–VIII) and Secondary (Class IX–X, SSC).' },
    { title: 'Curriculum', text: 'NCTB National Curriculum in English Version, with extra emphasis on English language proficiency and activity-based learning.' },
    { title: 'Facilities', text: 'Library, science laboratory, medical / first-aid room, digital classrooms, computer lab and debate club.' },
    { title: 'Assessment', text: 'Regular class tests, a half-yearly examination and an annual examination, with report cards and parent–teacher meetings.' },
    { title: 'Co-curricular activities', text: 'Annual sports, cultural programmes, art competitions, debate, recitation, national-day celebrations and study tours.' },
    { title: 'Admission', text: 'Admission test and interview; see Admission Information for steps, documents and age guidelines.' },
    { title: 'Contact', text: 'Office calling time 9:00 am – 6:00 pm. Phone 01896-281602, 01753-555222. Email info@mahaad.edu.bd.' },
  ],
  // Put a PDF in /public (e.g. /files/prospectus.pdf) and add its path here to show a download button
  pdf: '',
};

// Home page "quick links" cards under the slider
export const quickLinks = [
  { title: 'Admission', text: 'Classes, age guidelines and how to apply', href: '/admission/information', cta: 'Apply Now', icon: FaGraduationCap },
  { title: 'Notice Board', text: 'Latest notices and announcements', href: '/notices', cta: 'View Notices', icon: FaBookOpen },
  { title: 'Academic Calendar', text: 'Exams, events and holidays of the year', href: '/campus/academic-calendar', cta: 'View Calendar', icon: FaChalkboardTeacher },
  { title: 'Rules & Regulations', text: 'Attendance, uniform, conduct and fees', href: '/admission/rules-and-regulations', cta: 'Read Rules', icon: FaUserTie },
];
