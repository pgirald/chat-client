/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "Roboto": "Roboto",
        "Krona": "Krona"
      },
      fontSize: {
        "xs": "12px",
        "sm": "17px",
        "1xl": "30px",
        "2xl": "38px",
      }
    },
  },
  plugins: [require('tailwindcss-unimportant')],
  variants: {},
  mode: "jit"
}