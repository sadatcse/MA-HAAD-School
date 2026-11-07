'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { FaPhoneAlt, FaEnvelope, FaClock, FaMapMarkerAlt, FaBullhorn, FaUserLock, FaGraduationCap } from 'react-icons/fa';
import { mainNav } from '@/config/navigation';
import { siteConfig, telHref } from '@/config/site';
import { cn } from '@/lib/utils';
import Container from '@/components/ui/Container';
import Logo from './Logo';

const isActive = (pathname, item) => {
  if (item.href === '/') return pathname === '/';
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return Boolean(item.children?.some((c) => pathname === c.href));
};

// Thin navy strip: contact details + notice board / staff login
function TopBar() {
  const { contact } = siteConfig;
  return (
    <div className="hidden bg-navy-950 text-[13px] text-white/80 md:block">
      <Container className="flex h-9 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <a href={telHref(contact.phones[0])} className="flex items-center gap-2 hover:text-gold-300">
            <FaPhoneAlt className="text-[11px] text-gold-400" aria-hidden /> {contact.phones.join(', ')}
          </a>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-gold-300">
            <FaEnvelope className="text-[11px] text-gold-400" aria-hidden /> {contact.email}
          </a>
          <span className="hidden items-center gap-2 lg:flex">
            <FaClock className="text-[11px] text-gold-400" aria-hidden /> Calling Time: {contact.callingTime}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/notices" className="flex items-center gap-1.5 rounded px-2 py-1 hover:text-gold-300">
            <FaBullhorn className="text-[11px] text-gold-400" aria-hidden /> Notice Board
          </Link>
          <Link href="/login" className="flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold text-navy-950 transition-colors hover:bg-gold-300">
            <FaUserLock aria-hidden /> Staff Login
          </Link>
        </div>
      </Container>
    </div>
  );
}

function InfoItem({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
        <Icon aria-hidden />
      </span>
      <div className="leading-tight">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <div className="mt-0.5 text-sm font-semibold text-navy-900">{children}</div>
      </div>
    </div>
  );
}

// Dropdown panel for one top-level item
function Dropdown({ item, alignRight, onNavigate }) {
  return (
    <div
      className={cn(
        'absolute top-full z-50 w-64 animate-fade-in pt-0',
        alignRight ? 'right-0' : 'left-0'
      )}
    >
      <ul className="overflow-hidden rounded-b-xl border-t-[3px] border-gold-400 bg-white py-2 shadow-2xl shadow-navy-950/20 ring-1 ring-black/5">
        {item.children.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              onClick={onNavigate}
              className="block px-5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-brand-50 hover:pl-6 hover:text-brand-700"
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DesktopNav({ pathname }) {
  const [open, setOpen] = useState(null);
  const closeTimer = useRef(null);
  const navRef = useRef(null);

  const openNow = (label) => {
    clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  // Close on Escape or a click outside the menu
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    const onClick = (e) => navRef.current && !navRef.current.contains(e.target) && setOpen(null);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <nav ref={navRef} aria-label="Main" className="sticky top-0 z-40 hidden bg-navy-900 shadow-lg shadow-navy-950/20 xl:block">
      <Container>
        <ul className="flex items-stretch justify-center">
          {mainNav.map((item, index) => {
            const active = isActive(pathname, item);
            const base = cn(
              'relative flex h-12 items-center gap-1 whitespace-nowrap px-3 text-[13.5px] font-medium transition-colors 2xl:px-4 2xl:text-sm',
              active ? 'text-gold-300' : 'text-white/90 hover:text-gold-300',
              'after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t after:bg-gold-400 after:transition-transform',
              active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            );
            if (!item.children) {
              return (
                <li key={item.href}>
                  <Link href={item.href} className={base} aria-current={active ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            }
            const isOpen = open === item.label;
            return (
              <li key={item.href} className="relative" onMouseEnter={() => openNow(item.label)} onMouseLeave={closeSoon}>
                <button
                  type="button"
                  className={base}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => (isOpen ? setOpen(null) : openNow(item.label))}
                >
                  {item.label}
                  <HiChevronDown className={cn('text-base opacity-70 transition-transform', isOpen && 'rotate-180')} aria-hidden />
                </button>
                {isOpen && <Dropdown item={item} alignRight={index >= mainNav.length - 3} onNavigate={() => setOpen(null)} />}
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}

function MobileMenu({ pathname, onClose }) {
  const [expanded, setExpanded] = useState(() => mainNav.find((item) => item.children && isActive(pathname, item))?.label || null);
  const { contact } = siteConfig;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={onClose} aria-label="Close menu" />
      <div id="mobile-menu" className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Logo size="sm" />
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Close menu">
            <HiX size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Mobile">
          <ul className="space-y-0.5">
            {mainNav.map((item) => {
              const active = isActive(pathname, item);
              if (!item.children) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn('block rounded-lg px-4 py-3 text-[15px] font-medium', active ? 'bg-brand-50 text-brand-700' : 'text-slate-800 hover:bg-slate-50')}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const isOpen = expanded === item.label;
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : item.label)}
                    aria-expanded={isOpen}
                    className={cn('flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-[15px] font-medium', active ? 'text-brand-700' : 'text-slate-800 hover:bg-slate-50')}
                  >
                    {item.label}
                    <HiChevronDown className={cn('text-lg text-slate-400 transition-transform', isOpen && 'rotate-180 text-brand-600')} aria-hidden />
                  </button>
                  {isOpen && (
                    <ul className="mb-2 ml-4 border-l-2 border-gold-300 pl-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            aria-current={pathname === child.href ? 'page' : undefined}
                            className={cn('block rounded-md px-3 py-2.5 text-sm', pathname === child.href ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-600 hover:bg-slate-50')}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-2 border-t border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          {contact.phones.map((phone) => (
            <a key={phone} href={telHref(phone)} className="flex items-center gap-2 font-medium text-navy-900">
              <FaPhoneAlt className="text-xs text-brand-600" aria-hidden /> {phone}
            </a>
          ))}
          <p className="flex items-center gap-2"><FaClock className="text-xs text-brand-600" aria-hidden /> {contact.callingTime}</p>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link href="/notices" onClick={onClose} className="rounded-lg border border-slate-300 bg-white py-2 text-center font-medium text-navy-900">Notices</Link>
            <Link href="/login" onClick={onClose} className="rounded-lg bg-navy-900 py-2 text-center font-medium text-white">Staff Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Site header: top bar → logo row → menu bar (sticky on desktop). On phones/tablets the logo row
// is sticky and holds the menu button.
export default function Navbar() {
  const pathname = usePathname() || '/';
  // The menu remembers the page it was opened on, so navigating closes it
  const [openOn, setOpenOn] = useState(null);
  const mobileOpen = openOn === pathname;
  const closeMenu = useCallback(() => setOpenOn(null), []);
  const { contact } = siteConfig;

  return (
    <>
      <TopBar />

      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur xl:static xl:border-0 xl:bg-white">
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-20 xl:h-24">
          <Logo size="lg" preload />

          <div className="hidden items-center gap-7 lg:flex">
            <InfoItem icon={FaPhoneAlt} label="Call us">
              <a href={telHref(contact.phones[0])} className="hover:text-brand-600">{contact.phones[0]}</a>
            </InfoItem>
            <InfoItem icon={FaMapMarkerAlt} label="Visit us">{contact.addressShort}</InfoItem>
            <Link
              href="/admission/information"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-md shadow-gold-500/30 transition hover:brightness-105"
            >
              <FaGraduationCap aria-hidden /> Admission
            </Link>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-white xl:hidden"
            onClick={() => setOpenOn(pathname)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <HiMenu size={24} />
          </button>
        </Container>
      </div>

      <DesktopNav key={pathname} pathname={pathname} />

      {mobileOpen && <MobileMenu pathname={pathname} onClose={closeMenu} />}
    </>
  );
}
