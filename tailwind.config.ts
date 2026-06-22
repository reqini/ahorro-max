import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#CC0000",
          yellow: "#F5C000",
          black: "#000000",
          white: "#FFFFFF",
          "gray-900": "#111111",
          "gray-800": "#1a1a1a",
        },
      },
      fontFamily: {
        impact: ["Impact", "'Arial Narrow'", "Oswald", "sans-serif"],
        body: ["Inter", "'Helvetica Neue'", "Arial", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out both",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}

export default config
