import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { copyFileSync, existsSync } from "node:fs";

function spa404() {
  return {
    name: "spa-404",
    closeBundle() {
      const src = path.resolve(__dirname, "dist/index.html");
      const dest = path.resolve(__dirname, "dist/404.html");
      if (existsSync(src)) copyFileSync(src, dest);
    },
  };
}

export default defineConfig({
  plugins: [react(), spa404()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        timeout: 120000,
        proxyTimeout: 120000,
      },
    },
  },
});
