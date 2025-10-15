import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    {
      name: 'inject-build-anchors',
      transformIndexHtml(html) {
        const sha = process.env.VITE_GIT_SHA || 'unknown';
        const time = process.env.VITE_BUILD_TIME || new Date().toISOString();
        return html
          .replace('%VITE_GIT_SHA%', sha)
          .replace('%VITE_BUILD_TIME%', time);
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
