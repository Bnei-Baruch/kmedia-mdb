/* eslint-disable */
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createViteServer } from 'vite';
//import compression from 'compression';
//import { resourceMonitorMiddleware } from 'express-watcher';
import * as middleware from './middleware';
import serverRender from './renderer';

const CRA_CLIENT_PORT = process.env.CRA_CLIENT_PORT || 3000;
const CRA_CLIENT_HOST = process.env.CRA_CLIENT_HOST || 'localhost';

const indexHtml = fs.readFileSync(path.resolve(__dirname, '..', 'build', 'critical.html'), 'utf8');
function handler(req, res, next) {
  serverRender(req, res, next, indexHtml);
}

// initialize the application and create the routes
const app = express();

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'custom',
});
app.use(vite.middlewares);

app.use(middleware.duration);
// app.use(middleware.logAll);
app.use(middleware.logErrors);
app.use(middleware.errorHandler);
// app.use(compression());
// app.use(resourceMonitorMiddleware);

const router = express.Router();

// root (/) should always serve our server rendered page
router.use('^/$', handler);

// serve locales
router.use('/locales', express.static(path.resolve(__dirname, '..', 'public', 'locales')));

// serve assets
router.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));

// anything else should act as our index page
// react-router will take care of everything
router.use('*', middleware.noLanguageRedirect);
router.use('*', handler);

// tell the app to use the above rules
app.use(router);

module.exports = app;
