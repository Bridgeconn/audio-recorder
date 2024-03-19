/** @type {import('tailwindcss').Config} */
// const colors = require('tailwindcss/colors');

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: 'ping 2s linear infinite',
      keyframes: {
        ping: { '75%, 100%': { transform: 'scale(1.2)', opacity: 0 } },
      },
    },
  },
  plugins: [],
};
