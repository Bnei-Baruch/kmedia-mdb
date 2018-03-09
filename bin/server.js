// ignore styles and replace images with their final path from webpack manifest
const path     = require('path');
const manifest = require('../build/asset-manifest');
require('ignore-styles').default(undefined, (module, filename) => {
  if (filename.endsWith('.png') ||
    filename.endsWith('.jpg') ||
    filename.endsWith('.svg')) {
    module.exports = `/${manifest[`static/media/${path.basename(filename)}`]}`;
  }
});

require('babel-register')({
  // ignore: [ /(node_modules)/ ],
  presets: ['env', 'react-app']
});

require('dotenv').config();
// console.log('env', process.env);

const app = require('../server');

const PORT = process.env.SERVER_PORT || 3001;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
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
