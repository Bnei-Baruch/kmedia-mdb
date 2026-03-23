const fs = require("fs");
const path = require("path");
const express = require("express");
const { createServer: createViteServer } = require("vite");

const NAMESPACE = "app-server";

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  // serve locales and assets
  app.use("/locales", express.static(path.resolve(__dirname, "..", "public", "locales")));
  app.use("/assets", express.static(path.join(__dirname, "..", "public", "assets")));

  app.use(async (req, res, next) => {
    const url = req.originalUrl;
    console.log(NAMESPACE, "request received", url);
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
      let appHtml = await render(req);
      console.log(NAMESPACE, "appHtml", appHtml);
      appHtml = await vite.transformIndexHtml(url, appHtml);
      console.log(NAMESPACE, "transformed appHtml", appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(appHtml);
    } catch (e) {
      console.error(NAMESPACE, "error rendering app", e);
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(3000);
}

createServer();
