import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jade: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        lotus: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        display: ['var(--font-clash)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #22c55e 0%, #ec4899 50%, #f59e0b 100%)',
        'aurora-mesh': 'radial-gradient(at 40% 20%, #22c55e 0px, transparent 50%), radial-gradient(at 80% 0%, #ec4899 0px, transparent 50%), radial-gradient(at 0% 50%, #f59e0b 0px, transparent 50%), radial-gradient(at 80% 50%, #6366f1 0px, transparent 50%), radial-gradient(at 0% 100%, #22c55e 0px, transparent 50%), radial-gradient(at 80% 100%, #ec4899 0px, transparent 50%), radial-gradient(at 0% 0%, #f59e0b 0px, transparent 50%)',
      },
      animation: {
        'aurora-shift': 'aurora-shift 20s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'aurora-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
