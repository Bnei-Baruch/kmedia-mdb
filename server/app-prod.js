import fs from 'fs';
import path from 'path';
import express from 'express';

import serverRender from './renderer';

function handler(req, res) {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

  // eslint-disable-next-line consistent-return
  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(404).end();
    }

    serverRender(req, res, htmlData);
  });
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

module.exports = app;
