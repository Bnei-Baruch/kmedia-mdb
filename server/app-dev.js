import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import proxy from 'http-proxy-middleware';
import { resourceMonitorMiddleware } from 'express-watcher';

import * as middleware from './middleware';
import serverRender from './renderer';

const CRA_CLIENT_PORT = process.env.CRA_CLIENT_PORT || 3000;

function handler(req, res, next) {
  http.get(`http://localhost:${CRA_CLIENT_PORT}/index.html`, (result) => {
    result.setEncoding('utf8');
    let htmlData = '';
    result.on('data', (chunk) => {
      htmlData += chunk;
    });
    result.on('end', () => {
      serverRender(req, res, next, htmlData);
    });
  }).on('error', next);
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

// serve assets
router.use('/assets', express.static(
  path.join(__dirname, '..', 'public', 'assets'),
));

// proxy other static assets to create-react-app dev server
router.use(['**/*.*', '/static', '/sockjs-node'], proxy({
  target: `http://localhost:${CRA_CLIENT_PORT}`,
  changeOrigin: true,
  ws: true
}));

// anything else should act as our index page
// react-router will take care of everything
router.use('*', handler);

// tell the app to use the above rules
app.use(router);

app.use(middleware.logErrors);
app.use(middleware.errorHandler);

module.exports = app;
