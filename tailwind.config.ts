import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf8ee",
          100: "#faeed5",
          200: "#f3ddab",
          300: "#e9c873",
          400: "#ddb04a",
          500: "#c58b2b",
          600: "#a87123",
          700: "#875720",
          800: "#6e471f",
          900: "#5c3b1e",
        },
        accent: {
          50: "#fff4ec",
          100: "#ffe6d5",
          200: "#ffc9a8",
          300: "#ffa36f",
          400: "#ff7a36",
          500: "#ff6f00",
          600: "#e65100",
          700: "#bf3e00",
          800: "#963400",
          900: "#7a2c05",
        },
        navy: {
          50: "#f0f4f8",
          100: "#dce6ee",
          200: "#b8cddd",
          300: "#8fafc6",
          400: "#5d8baa",
          500: "#36678c",
          600: "#254d6e",
          700: "#183852",
          800: "#0b1e36",
          900: "#08162a",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-down": "slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
export default config
