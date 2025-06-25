import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://city-park-hub-1rf7.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          // Remove the /api prefix and add it back to the target URL
          const newPath = path.replace(/^\/api/, '');
          return `/api${newPath}`;
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
