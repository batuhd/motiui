/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kagit': '#F4F1EA',
        'altin': '#C5A059',
        'cinili': '#003366',
      },
    },
  },
  plugins: [],
}