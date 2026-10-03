/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050B16',
        surface: '#0A1322',
        surface2: '#101C2D',
        'primary-cyan': '#25D9FF',
        'primary-blue': '#2878FF',
        'text-main': '#F5F7FA',
        'text-muted': '#8B9AAF',
        critical: '#FF4D5D',
        warning: '#FFB547',
        success: '#36D399',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}