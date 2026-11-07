import { notFound } from 'next/navigation';
import { sectionLinks } from '@/config/navigation';
import { getStaffGroup } from '@/data/staff';
import { listStaff } from '@/server/services/content.service';
import { images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SubpageLayout from '@/components/school/SubpageLayout';
import { Kicker } from '@/components/school/SectionHeading';
import { ComingSoon, PersonPhoto } from '@/components/school/Blocks';

export async function generateMetadata({ params }) {
  const group = getStaffGroup((await params).slug);
  return group ? { title: group.title, description: group.intro } : {};
}

function MemberCard({ member }) {
  return (
    <li className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <PersonPhoto photo={member.photo} name={member.name} className="h-32 w-32 rounded-full ring-4 ring-gold-200 ring-offset-2" sizes="128px" />
      <p className="mt-5 font-display text-lg text-navy-900">{member.name}</p>
      {member.designation && <p className="mt-2 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">{member.designation}</p>}
      {member.subject && <p className="mt-2 text-sm text-brand-700">{member.subject}</p>}
      {member.qualification && <p className="mt-1 text-xs text-slate-500">{member.qualification}</p>}
    </li>
  );
}

export default async function StaffPage({ params }) {
  const { slug } = await params;
  const group = getStaffGroup(slug);
  if (!group) notFound();
  // People are managed in Dashboard → Teachers & Staff
  const members = await listStaff(slug).catch(() => []);

  return (
    <>
      <PageBanner title={group.title} subtitle={group.intro} breadcrumbs={[{ label: 'Administration', href: '/administration' }, { label: group.title }]} image={images.sportsTeachers} />
      <SubpageLayout title="Administration" links={sectionLinks('/administration')} current={`/administration/${slug}`}>
        <Kicker>{group.kicker}</Kicker>
        <h2 className="mt-4 font-display text-3xl text-navy-900">{group.title}</h2>
        <p className="prose-school mt-3">{group.intro}</p>

        <div className="mt-10">
          {members.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((member) => <MemberCard key={member._id} member={member} />)}
            </ul>
          ) : (
            <ComingSoon
              title="This list is being updated"
              text={`The ${group.title.toLowerCase()} list will be published here soon. For any information, please contact the school office.`}
            />
          )}
        </div>
      </SubpageLayout>
    </>
  );
}
