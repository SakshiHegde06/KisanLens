/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // KisanLens palette — deep field green as the structural color,
        // warm soil clay as the sparse accent, no cream/terracotta defaults.
        canvas: "#FAFAF8",
        ink: "#1A2E22",
        forest: {
          DEFAULT: "#2F6F4E",
          dark: "#234F38",
          light: "#E7F1EB",
        },
        clay: {
          DEFAULT: "#A6672B",
          light: "#F3E7DA",
        },
        rust: "#B3452C",
        border: "#E4E4DF",
        muted: "#6B7280",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
