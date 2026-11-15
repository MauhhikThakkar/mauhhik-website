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
        // Geist is loaded in src/app/layout.tsx and exposed as CSS variables
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // Page backgrounds. Class names are unchanged so existing pages pick up the new values.
        charcoal: {
          DEFAULT: '#101114', // Page background
          light: '#1A1C20',   // Raised surfaces (cards)
          dark: '#0A0B0D',    // Recessed areas (footer, insets)
        },
        // Hairline borders
        line: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.16)',
        },
        // The single accent. Use for status, links and small highlights only.
        accent: {
          DEFAULT: '#7FDDBB',
          muted: 'rgba(127, 221, 187, 0.12)',
        },
      },
      maxWidth: {
        site: '72rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
export default config;
