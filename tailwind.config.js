/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['"Roboto Condensed"']
      },
      container: {
        center: true,
        padding: '3rem',
      },
      screens: {
        'sm': '576px',
        'md': '768px',
        'lg': '992px',
        'xl': '1200px',
        '2xl': '1400px',
      }, 
      colors: {
        bgSidebar: '#172554',
        bgMain: '#bae6fd',
      },
      spacing: {
        "10%": "10%",
        "100%": "100%"
      },
      height: {
        '97': '39rem',
      }
    },
  },
  plugins: [],
}