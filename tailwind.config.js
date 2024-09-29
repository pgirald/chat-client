/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "xs": "8px",
        "sm": "12px",
        "2xl": "1.563rem"
      },
    },
  },
  plugins: [require('tailwindcss-unimportant')],
  variants: {},
  mode: "jit"
}