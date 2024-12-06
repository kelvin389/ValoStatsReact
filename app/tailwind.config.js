/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      fontSize: {
        "1.5xl": "1.375rem",
        "2.5xl": "1.625rem",
      },
      screens: {
        xs: "500px",
        mdplus: "800px",
      },
      spacing: {
        searchbar: "24px",
      },
    },
  },
  plugins: [],
};
