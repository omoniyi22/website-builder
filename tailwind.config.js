/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['productRegular', 'preoductBold'], // Add your custom font
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}