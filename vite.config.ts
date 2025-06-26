import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          ws: true,
          onError: (err: Error, config: any) => {
            console.error('Proxy error:', err);
          },
          configure: (proxy: any) => {
            proxy.on('error', (err: Error, req: any, res: any) => {
              console.error('Proxy error:', err);
            });
            proxy.on('proxyRes', (proxyRes: any) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
              proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
            });
          },
          rewrite: (path: string) => path.replace(/^\/api/, '')
        }
      }
    }
  };
});