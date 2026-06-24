import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig, loadEnv } from "vite";

function ignoreStyles() {
  return {
    name: "ignore-styles",
    load(id) {
      if (/\.(css|scss|sass|less|styl)(\?.*)?$/.test(id)) return "";
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
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
      "process.env": JSON.stringify({ ...env, NODE_ENV: "production" }),
    },
    envPrefix: "REACT_APP_",
  };
});
