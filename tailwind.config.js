/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAF9",
        surface: "#FFFFFF",
        border: "#E7E5E4",
        ink: "#0C0A09",
        muted: "#78716C",
        accent: "#0EA5E9",
        danger: "#DC2626",
      },
    },
  },
  plugins: [],
};
