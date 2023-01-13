/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'searchbox-md': { max: '1350px' },
        'screen-xxl': { min: '1350px' },
        'screen-xxxl': { min: '1550px' },
      },
    },
  },
  plugins: [],
};
