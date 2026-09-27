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
        leap: {
          bg: "#FAF6F0",
          card: "#FFFFFF",
          cream: "#F4EBE1",
          creamborder: "#E8DACB",
          dark: "#1A1715",
          charcoal: "#2D2824",
          muted: "#78716C",
          orange: "#E25619",
          "orange-dark": "#C0420E",
          "orange-light": "#FF6B2B",
          gold: "#D9931E",
          amber: "#F2A900",
          yellow: "#FBBF24",
        }
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        'pattern-mandala': "radial-gradient(circle at 10% 20%, rgba(226, 86, 25, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(217, 147, 30, 0.06) 0%, transparent 40%)",
      },
      boxShadow: {
        'glow-orange': '0 10px 30px -10px rgba(226, 86, 25, 0.35)',
        'ticket': '0 20px 40px -15px rgba(26, 23, 21, 0.12), 0 0 0 1px rgba(232, 218, 203, 0.6)',
      }
    },
  },
  plugins: [],
};

export default config;
