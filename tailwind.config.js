/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        bg: "var(--bg)",
        text: "var(--text)",
        border: "var(--border)",
      },
      fontFamily: {
        body: ["Roboto", "sans-serif"],
        heading: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};
