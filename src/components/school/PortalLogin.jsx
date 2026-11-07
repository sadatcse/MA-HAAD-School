'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { images } from '@/data/school';
import { cn } from '@/lib/utils';

const field =
  'h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100';

// Sign-in screen for a portal. If the portal has an online system (`portal.url`), the button
// opens it; otherwise the visitor is told how to get access from the school office.
export default function PortalLogin({ portal, group, siblings = [] }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const { contact } = siteConfig;

  const submit = (e) => {
    e.preventDefault();
    if (portal.url) {
      window.location.href = portal.url;
      return;
    }
    setMessage(
      `Online sign-in for the ${portal.title} is being set up. Your login details will be provided by the school office — please call ${contact.phones[0]} (${contact.callingTime}).`
    );
  };

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-navy-900/10 ring-1 ring-slate-200 lg:grid-cols-2">
      <div className="relative hidden min-h-[520px] lg:block">
        <Image src={images.sportsTeam} alt="" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/80 to-brand-800/50" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-300">{group.title}</p>
          <p className="mt-2 font-display text-3xl">{portal.title}</p>
          <p className="mt-2 text-sm text-white/75">{portal.audience}</p>
          {siblings.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {siblings.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${group.key}/${p.slug}`}
                  className={cn('rounded-full px-3 py-1 text-xs font-medium transition', p.slug === portal.slug ? 'bg-gold-400 text-navy-950' : 'bg-white/10 text-white hover:bg-white/20')}
                >
                  {p.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-10">
        <Image src={siteConfig.logo} alt={siteConfig.name} width={1200} height={370} className="h-12 w-auto" />
        <h2 className="mt-8 font-display text-2xl text-navy-900 sm:text-3xl">Sign in</h2>
        <p className="mt-1 text-sm text-slate-500">
          {portal.title} · <span className="text-slate-600">{portal.audience}</span>
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="portal-id" className="mb-1.5 block text-sm font-medium text-slate-700">{portal.idLabel}</label>
            <div className="relative">
              <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input id="portal-id" name="username" autoComplete="username" required className={field} placeholder={`Enter your ${portal.idLabel.toLowerCase()}`} />
            </div>
          </div>
          <div>
            <label htmlFor="portal-password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input id="portal-password" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required className={cn(field, 'pr-12')} placeholder="Enter your password" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:text-brand-600" aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <FaEyeSlash aria-hidden /> : <FaEye aria-hidden />}
              </button>
            </div>
          </div>

          {message && (
            <p role="status" className="flex gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm leading-relaxed text-brand-800">
              <FaInfoCircle className="mt-0.5 shrink-0" aria-hidden /> {message}
            </p>
          )}

          <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-navy-900 to-brand-700 text-sm font-semibold text-white shadow-lg shadow-navy-900/20 transition hover:brightness-110">
            {portal.url ? <FaExternalLinkAlt aria-hidden /> : <FaSignInAlt aria-hidden />} Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Forgot your password or need an account? Contact the school office at{' '}
          <a href={`mailto:${contact.email}`} className="font-medium text-brand-600 hover:underline">{contact.email}</a>.
        </p>
      </div>
    </div>
  );
}
