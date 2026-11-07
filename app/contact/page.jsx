import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaDirections } from 'react-icons/fa';
import { siteConfig, telHref } from '@/config/site';
import { images } from '@/data/school';
import PageBanner from '@/components/school/PageBanner';
import SectionHeading, { Kicker } from '@/components/school/SectionHeading';
import Container from '@/components/ui/Container';
import ContactForm from '@/components/forms/ContactForm';

export const metadata = {
  title: 'Contact Us',
  description: `Address, phone numbers, email and calling time of ${siteConfig.name}, Khilkhet, Dhaka.`,
};

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-navy-900 to-brand-600 text-xl text-white shadow-lg">
        <Icon aria-hidden />
      </span>
      <p className="mt-4 font-display text-lg text-navy-900">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const { contact } = siteConfig;
  return (
    <>
      <PageBanner title="Contact Us" subtitle="We'd love to hear from you." breadcrumbs={[{ label: 'Contact Us' }]} image={images.openingCeremony} />

      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading kicker="Get in touch" title="For Any Inquiries & Assistance" subtitle={`Call us during calling time (${contact.callingTime}) or send us a message.`} />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard icon={FaMapMarkerAlt} title="Visit Us">
              <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700">{contact.address}</a>
            </InfoCard>
            <InfoCard icon={FaPhoneAlt} title="Call Us">
              {contact.phones.map((phone) => (
                <a key={phone} href={telHref(phone)} className="block font-semibold text-navy-900 hover:text-brand-700">{phone}</a>
              ))}
            </InfoCard>
            <InfoCard icon={FaEnvelope} title="Email Us">
              <a href={`mailto:${contact.email}`} className="break-all hover:text-brand-700">{contact.email}</a>
            </InfoCard>
            <InfoCard icon={FaClock} title="Calling Time">
              {contact.callingTime}
            </InfoCard>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <Kicker>Send message</Kicker>
            <h2 className="mt-4 font-display text-3xl text-navy-900">Drop Us a Line</h2>
            <p className="mt-2 text-slate-500">Have a question about admission, or want to visit the school? Send us a message and we will get back to you.</p>
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-xl shadow-navy-900/5 ring-1 ring-slate-200 sm:p-8">
              <ContactForm />
            </div>
          </div>

          <div className="flex flex-col">
            <Kicker>Find us</Kicker>
            <h2 className="mt-4 font-display text-3xl text-navy-900">Our Location</h2>
            <p className="mt-2 text-slate-500">{contact.address}</p>
            <div className="mt-6 min-h-[360px] flex-1 overflow-hidden rounded-2xl shadow-xl shadow-navy-900/5 ring-1 ring-slate-200">
              <iframe
                title={`Map — ${siteConfig.name}`}
                src={contact.mapEmbed}
                className="h-full min-h-[360px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a href={telHref(contact.phones[0])} className="flex items-center justify-center gap-2 rounded-xl bg-navy-900 py-3 text-sm font-semibold text-white hover:bg-navy-800">
                <FaPhoneAlt aria-hidden /> Call Now
              </a>
              <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-brand-300 bg-white py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50">
                <FaDirections aria-hidden /> Directions
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
