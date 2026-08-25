/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#070913',
          card: 'rgba(15, 23, 42, 0.65)',
          border: 'rgba(56, 189, 248, 0.2)',
          accent: '#06b6d4',
          neon: '#a855f7',
          pink: '#ec4899',
          cyan: '#38bdf8',
          glow: '#6366f1',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(168, 85, 247, 0.8))' },
        },
      },
    },
  },
  plugins: [],
};
