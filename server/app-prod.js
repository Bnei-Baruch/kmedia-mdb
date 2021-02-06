import fs from 'fs';
import path from 'path';
import express from 'express';
import helmet from 'helmet';

import * as middleware from './middleware';
import serverRender from './renderer';
import { kmediaContainer, kmediaSearch } from './kmedia';

const indexHtml = fs.readFileSync(path.resolve(__dirname, '..', 'build', 'critical.html'), 'utf8');

function handler(req, res, next) {
  serverRender(req, res, next, indexHtml);
}

// initialize the application and create the routes
const app = express();

const router = express.Router();

// middleware
// app.use(middleware.logAll);
app.use(middleware.logErrors);
app.use(middleware.errorHandler);

// security headers
app.use(helmet({
  frameguard: false,          // we want to allow embed in iframes
  dnsPrefetchControl: false,  // we use dns prefetch in index.html to speed things up.
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
      ]
    },
    browserSniff: false       // we're not targeting really old browsers
  }
}));

router.use('^/health_check$', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

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

router.use('/:lang(en|he|ru|es|de|tr|ua)?/ui/:cnID', kmediaContainer);
router.use('/:cnID(index.php)$', kmediaContainer);
router.use('/:lang(en|he|ru|es|de|tr|ua)?/ui/?', kmediaSearch);

// anything else should act as our index page
// react-router will take care of everything
router.use('*', handler);

// tell the app to use the above rules
app.use(router);

module.exports = app;
