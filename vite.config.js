import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            "babel-plugin-lodash",
            [
              "babel-plugin-module-resolver",
              {
                root: ["./src"],
                alias: { "@": "./src" },
              },
            ],
          ],
          presets: [
            ["@babel/preset-env", { targets: { node: "current" }, modules: false }]
          ],
        },
      }),
      svgr(),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
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
    },
    esbuild: {
      loader: "jsx",
      include: /.*\.js$/,
      exclude: [],
    },
    optimizeDeps: {
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
  };
});
