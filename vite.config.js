import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import Beasties from "beasties";
import fs from "node:fs";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

function criticalCss() {
  return {
    name: "critical-css",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      // preload:false keeps the full stylesheet as a plain <link rel="stylesheet">
      // (critical CSS still inlined). The "swap" strategy injects an inline
      // onload handler, which the strict CSP (script-src-attr 'none') blocks.
      const beasties = new Beasties({ path: "build", preload: false, pruneSource: false });
      for (const file of ["index.html", "index-anon.html"]) {
        const filePath = `build/${file}`;
        if (!fs.existsSync(filePath)) continue;
        const html = fs.readFileSync(filePath, "utf8");
        fs.writeFileSync(filePath, await beasties.process(html));
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      tailwindcss(),
      react({
        include: /\.(js|jsx|ts|tsx)$/,
      }),
      svgr(),
      criticalCss(),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    server: {
      open: true,
      port: 3000,
      proxy: {
        "/api": "http://localhost:8080",
      },
    },
    build: {
      outDir: "build",
      // nginx reserves /assets/ for media (served from a separate volume);
      // emit the frontend bundle under /static/ like the pre-Vite build so
      // it is served from /sites/archive-frontend/static/ via `location /static/`.
      assetsDir: "static",
      sourcemap: true,
      rollupOptions: {
        input: {
          main: "index.html",
          anon: "index-anon.html",
        },
      },
    },
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.js$/,
    },
    optimizeDeps: {
      entries: ["index.html", "index-anon.html"],
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    define: {
      "process.env": env,
      // Some deps (e.g. crc32) reference the Node `global`. Map it to `globalThis`
      // (defined in both browser and Node) rather than `window`, so it works in
      // the browser bundle without breaking dev SSR (where `window` is undefined).
      global: "globalThis",
    },
    envPrefix: "REACT_APP_", // keep old env var names
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/setupTests.js"],
      include: ["src/**/*.{test,spec}.{js,jsx}"],
    },
  };
});
