import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import logger from '../src/logger/logger.js';
import { favicon, noLanguageRedirect } from './middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NAMESPACE = 'app-server';
const isProd = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();
  let vite;

  if (isProd) {
    const { default: compression } = await import('compression');
    app.use(compression());
    app.use(express.static(path.resolve(__dirname, '..', 'build'), { index: false }));
  } else {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  }

  app.use('/locales', express.static(path.resolve(__dirname, '..', 'public', 'locales')));
  app.use(favicon);
  app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));

  app.use(noLanguageRedirect);

  app.use(async (req, res, next) => {
    const url = req.originalUrl;
    logger.log(NAMESPACE, 'request received', url);

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

  app.listen(3000, () => {
    logger.info(NAMESPACE, 'server listening on http://localhost:3000');
  });
}

createServer();
