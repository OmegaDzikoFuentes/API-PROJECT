/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'powder-blue': '#B0E0E6', // Define your powder blue color
          // You can add more custom colors here if needed for the Bel Air theme
        },
        // You might want to customize fonts to match the era
        fontFamily: {
          'retro-script': ['Satisfy', 'cursive'], // 'Satisfy' is the font name, 'cursive' is a fallback
        // You can add more font families here for the slab serif or sans-serif options
        'slab': ['Rockwell', 'serif'], // Example for Rockwell
        'clean': ['Montserrat', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }