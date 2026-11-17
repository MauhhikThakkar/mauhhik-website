import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // IBM Plex is self-hosted through @fontsource, imported in src/app/layout.tsx
        sans: ['"IBM Plex Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      /**
       * Light theme (design concept D).
       *
       * The site was built dark, with text-white, text-zinc-* and bg-charcoal
       * everywhere. Rather than touch every page, the light theme re-points
       * those names: "white" is now the ink colour, "black" is paper, the zinc
       * scale runs from dark text (100) to pale surfaces (950), and "charcoal"
       * is the page background. New components use ink, paper and highlight.
       */
      colors: {
        white: '#0F1B2D',
        black: '#FFFFFF',
        zinc: {
          50: '#0F1B2D',
          100: '#1A2638',
          200: '#223044',
          300: '#2E3A4E',
          400: '#3B4658',
          500: '#525D6F',
          600: '#5F6A7C',
          700: '#C4CAD4',
          800: '#DDE2EA',
          900: '#EDF0F5',
          950: '#F6F7F9',
        },
        charcoal: {
          DEFAULT: '#F6F7F9', // Page background
          light: '#FFFFFF',   // Raised surfaces (cards)
          dark: '#EEF1F5',    // Recessed areas
        },
        line: {
          DEFAULT: 'rgba(15, 27, 45, 0.12)',
          strong: 'rgba(15, 27, 45, 0.22)',
        },
        // Links, labels, the status dot and small highlights
        accent: {
          DEFAULT: '#1D3FBF',
          muted: 'rgba(29, 63, 191, 0.08)',
        },
        // Amber: only for the headline figure, Delivered tags and the product-owner panel
        highlight: {
          DEFAULT: '#F2B33D',
        },
        // Dark navy bands (results, contact) and the text that sits on them
        ink: {
          DEFAULT: '#0F1B2D',
          deep: '#0B1422',
          soft: '#C6D0E4',
          muted: '#A9B8D6',
        },
        paper: '#FFFFFF',
      },
      maxWidth: {
        site: '72.5rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(29, 63, 191, 0.45)' },
          '60%': { boxShadow: '0 0 0 9px rgba(29, 63, 191, 0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-dot': 'pulse-dot 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
