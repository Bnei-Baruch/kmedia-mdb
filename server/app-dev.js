/* eslint-disable import/no-extraneous-dependencies */
import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import proxy from 'http-proxy-middleware';
import { resourceMonitorMiddleware } from 'express-watcher';

import serverRender from './renderer';

const CRA_CLIENT_PORT = process.env.CRA_CLIENT_PORT || 3000;

function handler(req, res) {
  http.get(`http://localhost:${CRA_CLIENT_PORT}/index.html`, (result) => {
    result.setEncoding('utf8');
    let htmlData = '';
    result.on('data', (chunk) => {
      htmlData += chunk;
    });
    result.on('end', () => {
      serverRender(req, res, htmlData);
    });
  }).on('error', (e) => {
    console.error(e.message);
    return res.status(404).end();
  });
}

// initialize the application and create the routes
const app = express();

app.use(compression());
app.use(resourceMonitorMiddleware);

const router = express.Router();

// root (/) should always serve our server rendered page
router.use('^/$', handler);

// serve locales
router.use('/locales', express.static(
  path.resolve(__dirname, '..', 'public', 'locales'),
));

// proxy other static assets to create-react-app dev server
router.use(['**/*.*', '/static', '/sockjs-node'], proxy({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true
}));

// anything else should act as our index page
// react-router will take care of everything
router.use('*', handler);

// tell the app to use the above rules
app.use(router);

module.exports = app;
