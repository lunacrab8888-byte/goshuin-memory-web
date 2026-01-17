/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9370DB',
        background: '#F8F6FC',
        surface: '#F0E8FA',
        foreground: '#2D1F47',
        muted: '#7B68A6',
        border: '#D9C9E8',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      }
    },
  },
  plugins: [],
}
