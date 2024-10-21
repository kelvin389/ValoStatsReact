/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      fontSize: {
        "2.5xl": "1.625rem",
      },
      colors: {
        overlay: "#00000066;",
      },
    },
  },
  plugins: [],
};
