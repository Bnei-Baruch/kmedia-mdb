import fs from 'fs';
import path from 'path';
import express from 'express';

import * as middleware from './middleware';
import serverRender from './renderer';

const indexHtml   = fs.readFileSync(path.resolve(__dirname, '..', 'build', 'index.html'), 'utf8');
const criticalCSS = fs.readFileSync(path.resolve(__dirname, '..', 'build', 'critical.css'), 'utf8');

function handler(req, res, next) {
  serverRender(req, res, next, indexHtml, criticalCSS);
}

// initialize the application and create the routes
const app = express();

const router = express.Router();

// root (/) should always serve our server rendered page
router.use('^/$', handler);

// serve static assets
// Note: in real production environment, nginx would do this before we do.
// This is useful when running in 'production' mode without such reverse proxy.
// On local dev machine for example
router.use(express.static(
  path.resolve(__dirname, '..', 'build'),
  { maxAge: '30d' },
));

// anything else should act as our index page
// react-router will take care of everything
router.use('*', handler);

// tell the app to use the above rules
app.use(router);

app.use(middleware.logErrors);
app.use(middleware.errorHandler);

module.exports = app;
