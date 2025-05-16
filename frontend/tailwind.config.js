/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#1a365d', // Deep navy blue
          600: '#152c4d',
          700: '#0f1e37',
          800: '#0a1625',
          900: '#050b12',
        },
        secondary: {
          50: '#fcf5f0',
          100: '#f9ebe1',
          200: '#f3d7c3',
          300: '#edc2a4',
          400: '#e7ad86',
          500: '#e19867', // Warm terracotta
          600: '#d37a45',
          700: '#b85c2b',
          800: '#944a26',
          900: '#773d23',
        },
        accent: {
          50: '#f5f5f5',
          100: '#ebebeb',
          200: '#e0e0e0',
          300: '#d6d6d6',
          400: '#b8b8b8',
          500: '#9e9e9e', // Neutral gray
          600: '#6e6e6e',
          700: '#4f4f4f',
          800: '#303030',
          900: '#121212',
        },
        success: {
          500: '#10b981', // Green
        },
        warning: {
          500: '#f59e0b', // Amber
        },
        error: {
          500: '#ef4444', // Red
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};