/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        ayu: {
          50: "#F2F2F2",
          100: "#E7E8E9",
          200: "#CED0D4",
          300: "#B4B7C0",
          400: "#969CAB",
          500: "#7A8399",
          600: "#626B84",
          700: "#4D556A",
          800: "#383F51",
          900: "#242936",
          950: "#13151B",
        },
      },
      maxWidth: {
        page: "var(--page-width)",
      },
      gridTemplateColumns: {
        header: "1fr minmax(auto, var(--page-width)) 1fr",
      },
    },
  },
  plugins: [],
};
