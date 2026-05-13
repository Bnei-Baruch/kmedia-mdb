/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

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
        'social-facebook': '#1877f2',
        'social-twitter': '#1da1f2',
        'social-whatsapp': '#25d366',
        'social-telegram': '#0088cc',
        'social-ok': '#ee8208',
      },
      height: {
        'button-sm': '32px',
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        'a': { color: '#4183c4', textDecoration: 'none' },
        'a:hover': { color: '#1e70bf' },
        'a:active': { color: '#4183c4' },
        'a:focus': { color: '#4183c4' },
        'blockquote': {
          display: 'block',
          borderLeftWidth: '2px',
          borderLeftStyle: 'solid',
          borderLeftColor: '#dcddde',
          margin: '2em 0 2em 2em',
          padding: '0 0 0 1em',
        },
      });
    }),
  ],
}
