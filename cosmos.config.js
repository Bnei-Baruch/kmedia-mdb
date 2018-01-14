module.exports = {
  globalImports: ['./public/semantic.min.css'],
  containerQuerySelector: '#root',
  webpackConfigPath: 'react-scripts/config/webpack.config.dev',
  publicPath: 'public',
  // Optional: Create this file when you begin adding proxies
  proxiesPath: 'src/cosmos.proxies'
};
