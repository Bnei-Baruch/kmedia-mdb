import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import logger from '../src/logger/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NAMESPACE = 'app-server';

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('/locales', express.static(path.resolve(__dirname, '..', 'public', 'locales')));
  app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));

  app.use(async (req, res, next) => {
    const url = req.originalUrl;
    logger.log(NAMESPACE, 'request received', url);

    try {
      const { render } = await vite.ssrLoadModule('/server/renderer.js');
      const { html, skipTransform } = await render(req);
      const appHtml = skipTransform ? html : await vite.transformIndexHtml(url, html);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(appHtml);
    } catch (e) {
      logger.error(NAMESPACE, 'error rendering app', e);
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(3000, () => {
    logger.info(NAMESPACE, 'server listening on http://localhost:3000');
  });
}

createServer();
