/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      /* ------------------------------------------------------------------
       * DESIGN TOKENS
       * Change `accent` / `violet` here to re-skin the entire portfolio.
       * ------------------------------------------------------------------ */
      colors: {
        ink: {
          950: '#04050a',
          900: '#070912',
          850: '#0a0d18',
          800: '#0e1220',
          700: '#151a2b',
          600: '#1e2438',
        },
        accent: {
          DEFAULT: '#22d3ee',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        iris: {
          DEFAULT: '#8b5cf6',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Sora Variable"', 'Sora', '"Inter Variable"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Fluid display sizes — the mobile layout never looks like a squashed desktop.
        'fluid-sm': 'clamp(0.95rem, 0.9rem + 0.3vw, 1.05rem)',
        'fluid-base': 'clamp(1rem, 0.95rem + 0.4vw, 1.15rem)',
        'fluid-lg': 'clamp(1.35rem, 1.1rem + 1.2vw, 1.9rem)',
        'fluid-xl': 'clamp(1.9rem, 1.4rem + 2.4vw, 3rem)',
        'fluid-2xl': 'clamp(2.4rem, 1.5rem + 4.2vw, 4.6rem)',
        'fluid-3xl': 'clamp(2.9rem, 1.4rem + 6.4vw, 6.5rem)',
      },
      maxWidth: {
        shell: '1200px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.18), 0 18px 60px -18px rgba(34,211,238,0.35)',
        'glow-iris': '0 0 0 1px rgba(139,92,246,0.2), 0 18px 60px -18px rgba(139,92,246,0.4)',
        lift: '0 24px 70px -30px rgba(0,0,0,0.85)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        /* Grid line alpha is deliberately low but not below the perceptual
           floor: 0.11 under the flat layer's 0.5 opacity lands ~6/255 above
           the ink-950 base, which reads as texture on a good panel without
           ever becoming a visible "graph paper" pattern. Drop it much further
           and the layer costs a paint while showing nothing. */
        'grid-fade':
          'linear-gradient(to right, rgba(148,163,184,0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.11) 1px, transparent 1px)',
        'accent-sweep': 'linear-gradient(110deg, #22d3ee 0%, #818cf8 45%, #8b5cf6 100%)',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        grid: '44px 44px',
      },
      keyframes: {
        'gradient-pan': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-22px,0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        caret: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'dash-flow': {
          to: { strokeDashoffset: '-1000' },
        },
        'marquee-x': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'gradient-pan': 'gradient-pan 8s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 11s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.2,1) infinite',
        caret: 'caret 1.05s step-end infinite',
        shimmer: 'shimmer 2.2s infinite',
        'spin-slow': 'spin-slow 22s linear infinite',
        'dash-flow': 'dash-flow 18s linear infinite',
        'marquee-x': 'marquee-x 32s linear infinite',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
        smooth: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
}
