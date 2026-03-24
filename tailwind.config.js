/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1A4378',
        'brand-orange': '#fc6719',
        'brand-orange-hover': '#e55c15',
        'semantic-blue': '#2185d0',
      },
      height: {
        'button-sm': '32px',
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
