/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0d1117',
          dark: '#010409',
        },
        primary: {
          DEFAULT: '#58a6ff',
          dark: '#1f6feb'
        },
        'text-primary': '#f0f6fc',
        'text-secondary': '#8b949e',
        'primary-dark': '#0d1117',
        accent: '#58a6ff',
        border: '#30363d',
        card: '#161b22',

        // Party colors
        party: {
          left: '#2f81f7',
          right: '#f85149',
          center: '#d29922',
          libertarian: '#fbc91b',
          green: '#2ea043',
          socialist: '#a371f7',
          nationalist: '#ff7b72',
          independent: '#8b949e',
        },

        // Utility
        warning: '#ffd33d',
        scandal: '#ff5555',
        disqualified: '#00000088',
      },
      boxShadow: {
        highlight: '0 0 8px 2px rgba(88, 166, 255, 0.4)',
        flip: '0 0 12px 3px rgba(255, 211, 61, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}; 