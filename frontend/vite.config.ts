import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";


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
      transformIndexHtml(html: string) {
        const sha = process.env.VITE_GIT_SHA || 'unknown';
        const time = process.env.VITE_BUILD_TIME || new Date().toISOString();
        return html
          .replace('__BUILD_SHA__', sha)
          .replace('__BUILD_TIME__', time);
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
