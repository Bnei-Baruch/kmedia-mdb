const { join } = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [
      join(__dirname, 'styles'),
    ],
  },
  async redirects() {
    return [
      {
        source: '/publications',
        destination: '/publications/blog',
        permanent: true,
      },
    ];
  },
  experimental: {
    // Required:
    appDir: true
  }
};

module.exports = nextConfig;
