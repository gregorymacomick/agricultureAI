/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agri-green': '#062C1B',
        'agri-emerald': '#10B981',
      }
    },
  },
  plugins: [],
}