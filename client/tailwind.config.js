/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4318FF",
        background: '#F7F5FD',
        'background-dark': '#252525',
      },
    },
  },
  plugins: [],
}

