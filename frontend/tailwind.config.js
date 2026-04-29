/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        soil: {
          50: "#fdf7ef",
          100: "#f5e8d3",
          200: "#e8c99a",
          300: "#d4a460",
          400: "#c4863a",
          500: "#a86b28",
          600: "#8a5420",
          700: "#6b3f18",
          800: "#4d2e12",
          900: "#2e1b0b",
        },
        leaf: {
          50: "#f0f7e8",
          100: "#d9edc0",
          200: "#b4d985",
          300: "#8abb4a",
          400: "#6a9e2e",
          500: "#4d7d1a",
          600: "#3a6012",
          700: "#2d4a1e",
          800: "#1f3314",
          900: "#101c0a",
        },
        seed: {
          50: "#fefbf0",
          100: "#fdf3d0",
          200: "#fae49a",
          300: "#f5cf52",
          400: "#e8b420",
          500: "#c8950e",
          600: "#a07508",
          700: "#785706",
          800: "#503b04",
          900: "#2a1f02",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "sway": "sway 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};
