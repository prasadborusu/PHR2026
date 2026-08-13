/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#FCFAF2',
          200: '#F3EFE0',
          300: '#E6DFCE',
        },
        prajna: {
          red: {
            DEFAULT: '#DC2626',
            hover: '#B91C1C',
            light: '#FEE2E2',
          },
          blue: {
            DEFAULT: '#1E3A8A',
            hover: '#172554',
            light: '#DBEAFE',
          }
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
