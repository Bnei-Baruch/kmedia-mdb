import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";

function ignoreStyles() {
  return {
    name: "ignore-styles",
    load(id) {
      if (/\.(css|scss|sass|less|styl)(\?.*)?$/.test(id)) return "";
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      ignoreStyles(),
      svgr(),
      react({
        include: /\.(js|jsx|ts|tsx)$/,
      }),
    ],
    resolve: {
      alias: { "@": "/src" },
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    build: {
      outDir: "build/server",
      ssr: true,
      rollupOptions: {
        input: {
          renderer: "server/renderer.js",
          kmedia: "server/kmedia.js",
        },
        output: {
          entryFileNames: "[name].js",
        },
      },
    },
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.js$/,
    },
    define: {
      // SSR runs in Node: read REACT_APP_* from the real runtime env (Docker runtime
      // stage / local .env via dotenv) instead of freezing build-time values. This lets
      // the server use its runtime API host (e.g. http://nginx/backend/) rather than the
      // browser's relative /backend/, which Node cannot resolve. Only NODE_ENV stays
      // build-time-fixed so prod optimizations (React, etc.) are applied at build.
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    envPrefix: "REACT_APP_",
  };
});
