const { join } = require('path');
const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  i18n,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [
      join(__dirname, 'styles'),
    ],
  },
};

module.exports = nextConfig;
