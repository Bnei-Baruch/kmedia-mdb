import express from 'express';
import path from 'path';

import serverRenderer from './renderer';

// initialize the application and create the routes
const app    = express();
const router = express.Router();

// root (/) should always serve our server rendered page
router.use('^/$', serverRenderer);

// other static resources should just be served as they are
router.use(express.static(
  path.resolve(__dirname, '..', 'build'),
  { maxAge: '30d' },
));

// anything else should act as our index page
// react-router will take care of everything
router.use('*', serverRenderer);


// tell the app to use the above rules
app.use(router);

module.exports = app;
