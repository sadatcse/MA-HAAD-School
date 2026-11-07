// Theme-aware colour tokens: each maps to a CSS variable set in src/styles/globals.css for
// light (:root) and dark (.dark). Use them instead of fixed greys so pages work in both modes:
//   bg-canvas (page) · bg-canvas-2 · bg-surface (cards) · bg-surface-2 · text-ink (headings) · text-ink-2
//   text-body · text-muted · text-subtle · text-faint · border-line/10 (hairlines; also bg-line/5 tints)
// The public website is always light; dark mode applies to the dashboard and login only.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

// MA HAAD blue (logo colour #126CB5)
const brand = {
  50: '#eef6fc',
  100: '#d7e9f8',
  200: '#b3d5f1',
  300: '#80b9e6',
  400: '#4797d6',
  500: '#2380c7',
  600: '#126cb5',
  700: '#0f5794',
  800: '#11497a',
  900: '#133e65',
  950: '#0d2742',
};

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx}', './app/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
    },
    extend: {
      screens: { '3xl': '1920px' },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      colors: {
        canvas: { DEFAULT: token('canvas'), 2: token('canvas-2') },
        surface: { DEFAULT: token('surface'), 2: token('surface-2') },
        ink: { DEFAULT: token('ink'), 2: token('ink-2') },
        body: token('body'),
        muted: token('muted'),
        subtle: token('subtle'),
        faint: token('faint'),
        line: token('line'),
        brand,
        // Deep navy used for the menu bar, page banners and footer
        navy: {
          600: '#1b3f73',
          700: '#143263',
          800: '#0e264f',
          900: '#0a1c3d',
          950: '#06122a',
        },
        // Warm gold accent (labels, highlights, buttons)
        gold: {
          50: '#fdf8ea',
          100: '#faeecb',
          200: '#f4da94',
          300: '#eec35c',
          400: '#e8ad35',
          500: '#d99520',
          600: '#bd7518',
          700: '#9c5818',
        },
        // Dashboard accent — same scale as the brand blue
        primary: brand,
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
