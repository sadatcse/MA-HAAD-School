'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const INTERVAL = 6000;

// Home page slider: each photo fills the whole hero area, with a shade on the text side so the
// writing stays readable. `slide.position` (an object-position class) keeps the people in view
// when the photo is cropped on narrow screens. Auto-plays (paused on hover / focus and for
// reduced-motion users); arrows, dots, ←/→ keys and swipe change slides.
export default function HeroSlider({ slides }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const touchX = useRef(null);

  const go = useCallback((next) => setIndex((i) => (next + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(id);
  }, [index, paused, count, go]);

  return (
    <section
      className="relative isolate h-[580px] overflow-hidden bg-navy-950 sm:h-[600px] lg:h-[660px] 2xl:h-[720px]"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(index - 1);
        if (e.key === 'ArrowRight') go(index + 1);
      }}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.image}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!active}
            className={cn('absolute inset-0 transition-opacity duration-1000', active ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0')}
          >
            <Image
              src={slide.image}
              alt={slide.alt || ''}
              fill
              sizes="100vw"
              quality={85}
              preload={i === 0}
              className={cn('object-cover', slide.position || 'object-center')}
            />
            {/* Shade: darker behind the text (left on desktop, bottom on phones) */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/55 to-navy-950/10 md:bg-gradient-to-r md:from-navy-950/90 md:via-navy-950/50 md:to-transparent" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/60 to-transparent" aria-hidden />

            <div className="container relative flex h-full max-w-7xl flex-col justify-end pb-36 sm:pb-40 md:justify-center md:pb-24 lg:pb-28 2xl:max-w-screen-2xl">
              <div className={cn('max-w-2xl transition-all delay-200 duration-700', active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0')}>
                <p className="inline-flex items-center gap-2 rounded-full bg-gold-400/95 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-navy-950">
                  {slide.kicker}
                </p>
                {i === 0 ? (
                  <h1 className="mt-4 text-balance font-display text-3xl leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">{slide.title}</h1>
                ) : (
                  <p className="mt-4 text-balance font-display text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">{slide.title}</p>
                )}
                <p className="mt-4 max-w-xl text-base text-white/90 drop-shadow sm:text-lg">{slide.text}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/admission/information"
                    tabIndex={active ? undefined : -1}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-gold-500/30 transition hover:brightness-105"
                  >
                    Admission Information <FaArrowRight aria-hidden />
                  </Link>
                  <Link
                    href="/about"
                    tabIndex={active ? undefined : -1}
                    className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    About Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-gold-400 hover:text-navy-950 lg:flex"
            aria-label="Previous slide"
          >
            <FaChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-gold-400 hover:text-navy-950 lg:flex"
            aria-label="Next slide"
          >
            <FaChevronRight aria-hidden />
          </button>
          <div className="container absolute inset-x-0 bottom-24 z-20 flex max-w-7xl gap-2 sm:bottom-28 2xl:max-w-screen-2xl">
            {slides.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => go(i)}
                className={cn('h-2.5 rounded-full transition-all', i === index ? 'w-8 bg-gold-400' : 'w-2.5 bg-white/60 hover:bg-white')}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
