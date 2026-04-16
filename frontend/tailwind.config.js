/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Inter", "PingFang SC", "Noto Sans SC", "Segoe UI", "sans-serif"],
        section: ["ABC Favorit", "Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Domaine Display", "Iowan Old Style", "Times New Roman", "serif"],
        mono: ["CommitMono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      colors: {
        brand: {
          50: "#eaf4ff",
          100: "#d6ebfd",
          500: "#3b9eff",
          600: "#0081fd",
          700: "#0075ff"
        },
        accent: {
          orange: "#ff801f",
          green: "#11ff99",
          yellow: "#ffc53d",
          red: "#ff2047"
        }
      }
    }
  },
  plugins: []
};
