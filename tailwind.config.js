/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
          colors: {
        primary: '#08227f', // remplace cette valeur par la couleur de ton logo
      },
    },
  },
  plugins: [],
};
