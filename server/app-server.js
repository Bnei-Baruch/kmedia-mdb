const fs = require("fs");
const path = require("path");
const express = require("express");
const { createServer: createViteServer } = require("vite");

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use(async (req, res, next) => {
    const url = req.originalUrl;
    console.log("serverRender: request received", url);
    /*
    try {
      let template = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
    } catch (e) {
      console.log("error transforming index.html", e);
      vite.ssrFixStacktrace(e);
      next(e);
    }
    
    // 4. Render app
     const { html, preloadedState } = render(url);
    
    // 5. Inject app and state into HTML
    const appHtml = template
    .replace(`<!--ssr-outlet-->`, html)
    .replace(
      `<!--ssr-state-->`,
      `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, "\\u003c")}</script>`
      ); 
      */

    try {
      const { render } = await vite.ssrLoadModule("/server/renderer.js");
      const appHtml = await render(req);
      res.status(200).set({ "Content-Type": "text/html" }).end(appHtml);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.log("error rendering app", e);
      next(e);
    }
  });

  app.listen(3000);
}

createServer();
