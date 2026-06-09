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
      const beasties = new Beasties({ path: "build", preload: "swap", pruneSource: false });
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
      // Locale files must be pre-bundled together with moment so they all share
      // the same module instance. Without this, locale imports register on the
      // original node_modules/moment.js while the app reads from the pre-bundled
      // chunk — two separate instances, so locales appear unregistered.
      include: [
        "moment/locale/cs",
        "moment/locale/de",
        "moment/locale/es",
        "moment/locale/he",
        "moment/locale/it",
        "moment/locale/ru",
        "moment/locale/tr",
        "moment/locale/uk",
      ],
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    define: {
      "process.env": env,
      global: "window",
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
