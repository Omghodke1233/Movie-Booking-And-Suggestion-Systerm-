/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bmsDark: '#0b0b0f',
        bmsCard: '#15151c',
        bmsCardHover: '#1e1e28',
        bmsRed: '#ff3b5c',
        bmsRedHover: '#e02444',
        gold: '#f59e0b',
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(255, 59, 92, 0.4)',
        cardGlow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}