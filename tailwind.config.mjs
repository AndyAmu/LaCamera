/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F5FA',
          100: '#DDE8F4',
          200: '#BCD3E9',
          300: '#91B7DB',
          400: '#5F95CA',
          500: '#3D77B5',
          600: '#2A5C95',
          700: '#204674',
          800: '#163255',
          900: '#0E223B',
          950: '#091526',
        },
        cream: {
          50: '#FBF9F5',
          100: '#F6F1E7',
          200: '#EDE4D2',
          300: '#E1D3B9',
          400: '#CEB994',
          500: '#B89F73',
          600: '#A18559',
          700: '#826945',
          800: '#675338',
          900: '#54442F',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          hover: '#20BA59',
          dark: '#128C7E',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        serif: [
          '"Newsreader"',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'Times',
          'serif',
        ],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(14, 34, 59, 0.06), 0 2px 6px -1px rgba(14, 34, 59, 0.04)',
        'card': '0 10px 30px -4px rgba(14, 34, 59, 0.08), 0 4px 8px -2px rgba(14, 34, 59, 0.03)',
      },
    },
  },
  plugins: [],
};
