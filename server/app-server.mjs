import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import logger from '../src/logger/logger.js';
import {
  isNonPage,
  noLanguageRedirect,
  staticFiles,
  duration,
  logErrors,
  errorHandler,
} from './middleware.js';
import { securityHeaders } from './security.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NAMESPACE = 'app-server';
const isProd = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();
  let vite;

  app.use(duration);

  if (isProd) {
    const { default: compression } = await import('compression');
    app.use(compression());
    app.use(securityHeaders);
    app.use(express.static(path.resolve(__dirname, '..', 'build'), { index: false, maxAge: '30d' }));
  } else {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  }

  app.use(staticFiles);

  // health check for load balancers / orchestrators
  app.get('/health_check', (req, res) => {
    res.status(200).send({ status: 'ok' });
  });

  // legacy kmedia URLs -> 301 redirects to canonical links (before language redirect)
  // loaded through Vite (dev) / SSR build (prod) so its src/ imports resolve
  const { kmediaContainer, kmediaSearch } = isProd
    ? await import(path.resolve(__dirname, '..', 'build/server/kmedia.js'))
    : await vite.ssrLoadModule('/server/kmedia.js');

  app.use('/ui/:cnID', kmediaContainer);
  app.use('/:lang/ui/:cnID', kmediaContainer);
  app.use('/index.php', kmediaContainer);
  app.use('/ui', kmediaSearch);
  app.use('/:lang/ui', kmediaSearch);

  app.use(noLanguageRedirect);

  app.use(async (req, res, next) => {
    if (isNonPage(req.path)) {
      return next();
    }

    const url = req.originalUrl;
    logger.log(NAMESPACE, 'request received', url, '| UA:', req.get('user-agent'));

    try {
      const { render } = isProd
        ? await import(path.resolve(__dirname, '..', 'build/server/renderer.js'))
        : await vite.ssrLoadModule('/server/renderer.js');

      const { html, skipTransform } = await render(req);
      const appHtml = !isProd && !skipTransform
        ? await vite.transformIndexHtml(url, html)
        : html;

      res.status(200).set({ 'Content-Type': 'text/html' }).end(appHtml);
    } catch (e) {
      logger.error(NAMESPACE, 'error rendering app', e);
      if (vite) vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.use(logErrors);
  app.use(errorHandler);

  const PORT = process.env.SERVER_PORT || 3001;
  app.listen(PORT, () => {
    logger.info(NAMESPACE, `server listening on http://localhost:${PORT}`);
  });
}

createServer();
