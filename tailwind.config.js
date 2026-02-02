/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FAF7F2",
        surface: "#FFFFFF",
        textPrimary: "#4A3F35",
        textSecondary: "#7A6C5F",
        accent: "#E6C9B5",
        muted: "#EDE4DA",
        border: "#E7DDD3",
      },
    },
  },
  plugins: [],
};
