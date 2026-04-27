/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    screens: {
      sm: '320px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    extend: {
      colors: {
        blue: {
          600: '#2185d0',
        },
        'brand-blue': '#1A4378',
        'brand-orange': '#fc6719',
        'brand-orange-hover': '#e55c15',
        'semantic-blue': '#2185d0',
        'blue-border': '#DBECF9',
        'blue-dark': '#134D78',
        'gray-light': '#F3F4F5',
        'blue-light': '#F4F9FB',
      },
      height: {
        'button-sm': '32px',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
