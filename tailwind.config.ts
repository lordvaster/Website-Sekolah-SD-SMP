// Author: Zeday | https://join.co.id
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A90E2",
          dark: "#3572B0",
          light: "#7CB0EC",
        },
        secondary: {
          DEFAULT: "#3DBE85",
          dark: "#2E9668",
          light: "#7FDCB0",
        },
        accent: {
          DEFAULT: "#FFB84D",
          dark: "#F2971A",
          light: "#FFD08A",
        },
        cta: {
          DEFAULT: "#FF6B6B",
          dark: "#E24C4C",
        },
        surface: {
          DEFAULT: "#F5F5F5",
          dark: "#151A21",
        },
        ink: {
          DEFAULT: "#333333",
          dark: "#EDEEF0",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
