import express from 'express';
import compression from 'compression';
import proxy from 'http-proxy-middleware';
import { resourceMonitorMiddleware } from 'express-watcher';

import serverRenderer from './renderer';

// initialize the application and create the routes
const app = express();

app.use(compression()); // TODO: remove in production - let nginx do this
app.use(resourceMonitorMiddleware); // TODO: remove in production - not needed

const router = express.Router();

// root (/) should always serve our server rendered page
router.use('^/$', serverRenderer);

// TODO: remove in production - let nginx do this
// Serve static assets
if (process.env.NODE_ENV === 'development') {
  // Connect proxy to Create React App dev server
  router.use(['**/*.*', '/static', '/sockjs-node'], proxy({
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true
  }));
  console.log('Connected to CRA Client dev server');
}

// other static resources should just be served as they are
// router.use(express.static(
//   path.resolve(__dirname, '..', 'public'),
//   { maxAge: '30d' },
// ));

// anything else should act as our index page
// react-router will take care of everything
router.use('*', serverRenderer);

// tell the app to use the above rules
app.use(router);

module.exports = app;
