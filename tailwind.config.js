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
        ayu: {
          50: "#F0F1F5",
          100: "#E3E6ED",
          200: "#C8CDDA",
          300: "#ACB4C8",
          400: "#8E98B4",
          500: "#7280A1",
          600: "#5C698A",
          700: "#49546E",
          800: "#373F53",
          900: "#242936",
          950: "#12151C",
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
