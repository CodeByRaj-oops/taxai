/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        'secondary': {
          DEFAULT: '#10b981',
          dark: '#059669',
          500: '#10b981',
          600: '#059669',
        },
        'dark': {
          bg: '#121212',
          card: '#1e1e1e',
          border: '#2e2e2e',
          text: '#e0e0e0',
          muted: '#a0a0a0'
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 