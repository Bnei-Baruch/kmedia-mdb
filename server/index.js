/* eslint-disable no-console */
// ignore styles and replace images with their final path from webpack manifest
import Loadable from 'react-loadable';

const path     = require('path');
const manifest = require('../build/asset-manifest');
require('ignore-styles').default(undefined, (module, filename) => {
  if (filename.endsWith('.png')
    || filename.endsWith('.jpg')
    || filename.endsWith('.jpeg')
    || filename.endsWith('.svg')) {
    // eslint-disable-next-line no-param-reassign
    module.exports = `/${manifest[path.join('static', 'media', path.basename(filename))]}`;
  }
});

require('babel-register')({
  presets: ['env', 'react-app'],
  plugins: [
    ['module-resolver', {
      alias: {
        'react-pdf/dist/entry.webpack': 'react-pdf'
      }
    }]
  ],
});

require('dotenv').config();
// console.log('env', process.env);

const app = process.env.NODE_ENV === 'development'
  ? require('./app-dev')
  : require('./app-prod');

const PORT = process.env.SERVER_PORT || 3001;

Loadable.preloadAll().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});

app.on('error', (error) => {
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
