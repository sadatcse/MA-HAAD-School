'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaFacebookF, FaLinkedinIn, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaClock,
  FaChevronRight, FaArrowUp, FaExternalLinkAlt,
} from 'react-icons/fa';
import { siteConfig, telHref } from '@/config/site';
import { footerNav, legalNav } from '@/config/navigation';
import { api } from '@/lib/api-client';
import Container from '@/components/ui/Container';
import Logo from './Logo';
import AppBadges from './AppBadges';

const SOCIAL_ICONS = { facebook: FaFacebookF, youtube: FaYoutube, linkedin: FaLinkedinIn };

function FooterLinks({ title, links }) {
  return (
    <nav aria-label={title}>
      <h3 className="font-display text-lg text-white">{title}</h3>
      <span className="mt-2 block h-0.5 w-10 rounded-full bg-gold-400" aria-hidden />
      <ul className="mt-5 space-y-1 text-sm">
        {links.map((link) => {
          const external = link.href.startsWith('http');
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                className="group flex items-start gap-2 py-1 text-white/70 transition-colors hover:text-gold-300"
              >
                <FaChevronRight className="mt-1.5 shrink-0 text-[9px] text-gold-400 transition-transform group-hover:translate-x-0.5" aria-hidden />
                <span>
                  {link.label}
                  {external && <FaExternalLinkAlt className="ml-1.5 inline text-[9px] opacity-50" aria-label="(opens in a new tab)" />}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ContactRow({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs text-gold-400 ring-1 ring-white/10">
        <Icon aria-hidden />
      </span>
      <div className="min-w-0 flex-1 pt-1.5 leading-relaxed">{children}</div>
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 animate-fade-in items-center justify-center rounded-full bg-gold-400 text-navy-950 shadow-lg shadow-navy-950/30 transition hover:bg-gold-300"
      aria-label="Back to top"
    >
      <FaArrowUp aria-hidden />
    </button>
  );
}

export default function Footer() {
  const [visitors, setVisitors] = useState(null);

  useEffect(() => {
    api.get('/visitor/summary').then((res) => setVisitors(res.data?.stats)).catch(() => {});
  }, []);

  const { contact } = siteConfig;
  const socials = Object.entries(siteConfig.social).filter(([key, url]) => url && SOCIAL_ICONS[key]);

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/80">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(18,108,181,0.35),transparent_55%)]" aria-hidden />

      <Container className="relative grid gap-x-10 gap-y-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-16">
        <div>
          <Logo size="h-12" variant="card" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{siteConfig.about}</p>

          <div className="mt-6 space-y-3 text-sm">
            <ContactRow icon={FaMapMarkerAlt}>
              <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">{contact.address}</a>
            </ContactRow>
            <ContactRow icon={FaPhoneAlt}>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {contact.phones.map((phone) => (
                  <a key={phone} href={telHref(phone)} className="whitespace-nowrap hover:text-gold-300">{phone}</a>
                ))}
              </div>
            </ContactRow>
            <ContactRow icon={FaClock}>Calling Time: {contact.callingTime}</ContactRow>
            <ContactRow icon={FaEnvelope}>
              <a href={`mailto:${contact.email}`} className="break-all hover:text-gold-300">{contact.email}</a>
            </ContactRow>
          </div>

          {socials.length > 0 && (
            <div className="mt-6 flex gap-2">
              {socials.map(([key, url]) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-colors hover:bg-gold-400 hover:text-navy-950"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <FooterLinks title="Quick Links" links={footerNav.quick} />
          <AppBadges className="mt-8 flex-col items-start" />
        </div>
        <FooterLinks title="Admission" links={footerNav.admission} />
        <FooterLinks title="Useful Links" links={footerNav.useful} />
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col items-center gap-4 py-6 text-center text-xs text-white/60 lg:flex-row lg:justify-between lg:text-left">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-300">{link.label}</Link>
              </li>
            ))}
          </ul>
          {visitors && (
            <ul className="flex flex-wrap justify-center gap-2" aria-label="Visitors">
              {[
                ['Today', visitors.today],
                ['Total', visitors.total],
                ['Online', visitors.online],
              ].map(([label, value]) => (
                <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
                  {label === 'Online' && <span className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden />}
                  {label}: <span className="font-semibold text-gold-300">{value}</span>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </div>

      <BackToTop />
    </footer>
  );
}
