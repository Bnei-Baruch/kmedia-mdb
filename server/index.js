// ignore styles and replace images with their final path from webpack manifest
require('ignore-styles');
require('file-loader');
const path     = require('path');
const manifest = require('../build/asset-manifest');
require('ignore-styles').default(undefined, (module, filename) => {
  const cleaned = filename.split('?')[0];
  if (cleaned.endsWith('.png')
    || cleaned.endsWith('.jpg')
    || cleaned.endsWith('.jpeg')
    || cleaned.endsWith('.svg')) {
    const key = path.join('static', 'media', path.basename(cleaned));
    const fromManifest = manifest[key];
    module.exports = fromManifest || `/assets/${path.basename(cleaned)}`;
  }
});

require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    'dynamic-import-node',
    'jaybe-react-loadable/babel',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-nullish-coalescing-operator',
    '@babel/plugin-transform-export-namespace-from',
    '@babel/plugin-proposal-throw-expressions',
  ],
});

require('dotenv').config();

const app = process.env.NODE_ENV === 'development'
  ? require('./app-dev')
  : require('./app-prod');

const PORT = process.env.SERVER_PORT || 3001;

app.listen(PORT, error => {
  if (error) {
    return console.log(`something bad happened: ${error} :(`);
  }

  return console.log(`App listening on port ${PORT}!`);
});

app.on('error', error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string'
    ? `Pipe ${PORT}`
    : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
