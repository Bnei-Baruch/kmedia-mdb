import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { resourceMonitorMiddleware } from 'express-watcher';

import * as middleware from './middleware';
import serverRender from './renderer';
import helmet from 'helmet';

const CRA_CLIENT_PORT = process.env.CRA_CLIENT_PORT || 3000;

function handler(req, res, next) {
  http.get(`http://localhost:${CRA_CLIENT_PORT}/index.html`, result => {
    result.setEncoding('utf8');
    let htmlData = '';
    result.on('data', chunk => {
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
router.use(['**/*.*', '/static', '/sockjs-node'], createProxyMiddleware({
  target: `http://localhost:${CRA_CLIENT_PORT}`,
  changeOrigin: true,
  ws: true
}));

// security headers
app.use(helmet({
  frameguard: false,          // we want to allow embed in iframes
  dnsPrefetchControl: false,  // we use dns prefetch in index.html to speed things up.
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      'default-src': [
        '\'self\'',
        '*.kbb1.com',
        '*.kli.one',
        'kabbalahmedia.info',
        '*.kabbalahmedia.info',
        'archive',                      // suitcase
        '*.archive',                    // suitcase
        '*.usersnap.com',
        '*.twimg.com',
        '*.youtube.com',
        '*.youtube-nocookie.com',
        '*.google-analytics.com',
        'stats.g.doubleclick.net',
        '*.kab.info',
        '*.kab.sh',
      ],
      'script-src': [
        '\'self\'',
        '\'unsafe-inline\'',
        '\'unsafe-eval\'',
        '*.google-analytics.com',
        '*.googletagmanager.com',
        'kabbalahmedia.info',
        'archive',                      // suitcase
        '*.usersnap.com',
        'cdnjs.cloudflare.com',         // for pdf worker
        'cdn.jwplayer.com',
        '*.jwpcdn.com',
        '*.hlsjs.js',
        'blob:',
      ],
      'style-src': [
        '\'self\'',
        '\'unsafe-inline\'',
        '*.googleapis.com',
      ],
      'font-src': [
        '\'self\'',
        'data:',
        'fonts.gstatic.com',
        'cdnjs.cloudflare.com',         // for sketches ionic icons. remove when possible
      ],
      'img-src': [
        '\'self\'',
        'data:',
        '*.kbb1.com',
        'kabbalahmedia.info',
        '*.kabbalahmedia.info',
        'archive',                      // suitcase
        '*.archive',                    // suitcase
        'laitman.ru',
        'www.laitman.ru',
        'laitman.com',
        'laitman.es',
        'laitman.co.il',
        '*.google-analytics.com',
        'stats.g.doubleclick.net',
        '*.usersnap.com',
        '*.twimg.com',
        '*.jwpltx.com',
      ],
      'media-src': [
        '\'self\'',
        'data:',
        'blob:',
        '*.kabbalahmedia.info',
        '*.kab.info',
        '*.kab.sh'
      ],
      'worker-src': [
        'blob:',
        '*.kabbalahmedia.info'
      ],
      'frame-ancestors': ['*'],
      'object-src': ['*.youtube.com']
    },
    browserSniff: false       // we're not targeting really old browsers
  }
}));

// anything else should act as our index page
// react-router will take care of everything
router.use('*', handler);

// tell the app to use the above rules
app.use(router);

app.use(middleware.logErrors);
app.use(middleware.errorHandler);

module.exports = app;
