import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom charcoal backgrounds for improved readability
        // Main background: clearly visible off-black (not pure black)
        charcoal: {
          DEFAULT: '#1A1B1E', // Main page background - noticeably lighter than black
          light: '#252629',   // Elevated surfaces (cards, sections) - clearly lighter
          dark: '#0E0F11',     // Deeper accents if needed
        },
      },
    },
  },
  plugins: [],
};
export default config;
