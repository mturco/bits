/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        "puerto-rico": {
          50: "#f1fcf9",
          100: "#d0f7f0",
          200: "#a0efe2",
          300: "#69dfd0",
          400: "#38c7b9",
          500: "#20aca0",
          600: "#178a83",
          700: "#176e69",
          800: "#175856",
          900: "#174a47",
          950: "#072c2c",
        },
      },
      width: {
        page: "var(--page-width)",
      },
      gridTemplateColumns: {
        header: "1fr minmax(auto, var(--page-width)) 1fr",
      },
    },
  },
  plugins: [],
};
