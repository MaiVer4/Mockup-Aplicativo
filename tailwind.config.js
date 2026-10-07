/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        academic: {
          navy: {
            950: '#061325',
            900: '#0b1e38',
            850: '#0f2747',
            800: '#143156',
            700: '#1b4170',
            600: '#23528b',
            100: '#e0eaf6',
            50: '#f0f5fb',
          },
          gold: {
            800: '#78350f',
            700: '#92400e',
            600: '#b45309',
            500: '#d97706',
            400: '#f59e0b',
            300: '#fcd34d',
            200: '#fde68a',
            100: '#fef3c7',
            50: '#fffbeb',
          },
          wine: {
            900: '#4c0519',
            800: '#881337',
            700: '#9f1239',
            100: '#ffe4e6',
            50: '#fff1f2',
          },
          forest: {
            900: '#052e16',
            800: '#064e3b',
            700: '#047857',
            600: '#059669',
            100: '#dcfce7',
            50: '#f0fdf4',
          }
        }
      }
    },
  },
  plugins: [],
}
